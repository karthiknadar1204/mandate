'use server'

import { google } from 'googleapis'
import { db } from '@/configs/db'
import { usersTable } from '@/configs/schema'
import { eq } from 'drizzle-orm'

async function refreshGoogleToken(refreshToken) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET
    )
    
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    })

    const { credentials } = await oauth2Client.refreshAccessToken()
    return credentials.access_token
  } catch (error) {
    console.error('Error refreshing Google token:', error)
    throw error
  }
}

export async function fetchUserEmails(accessToken, userEmail) {
  try {
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: accessToken })
    
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
    
    try {
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 15,
        format: 'full'
      })

      const messages = response.data.messages || []
      const emailDetails = await Promise.all(
        messages.map(async (message) => {
          const email = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
          })

          // Get email content
          let content = ''
          if (email.data.payload.parts) {
            // Handle multipart emails
            const textPart = email.data.payload.parts.find(part => part.mimeType === 'text/plain')
            if (textPart && textPart.body.data) {
              content = Buffer.from(textPart.body.data, 'base64').toString('utf-8')
            }
          } else if (email.data.payload.body && email.data.payload.body.data) {
            // Handle single part emails
            content = Buffer.from(email.data.payload.body.data, 'base64').toString('utf-8')
          }

          return {
            subject: email.data.payload.headers.find(h => h.name === 'Subject')?.value || 'No Subject',
            from: email.data.payload.headers.find(h => h.name === 'From')?.value || 'Unknown',
            date: email.data.payload.headers.find(h => h.name === 'Date')?.value || 'Unknown',
            content: content
          }
        })
      )

      return emailDetails
    } catch (error) {
      if (error.code === 401) {
        // Token expired, try to refresh
        const user = await db.query.usersTable.findFirst({
          where: eq(usersTable.email, userEmail)
        })

        if (!user || !user.refreshToken) {
          throw new Error('No refresh token available')
        }

        const newAccessToken = await refreshGoogleToken(user.refreshToken)
        
        // Update the user's access token in the database
        await db
          .update(usersTable)
          .set({
            accessToken: newAccessToken,
            updatedAt: new Date()
          })
          .where(eq(usersTable.email, userEmail))

        // Retry the request with the new token
        return fetchUserEmails(newAccessToken, userEmail)
      }
      throw error
    }
  } catch (error) {
    console.error('Error fetching emails:', error)
    return []
  }
} 