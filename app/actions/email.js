'use server'

import { google } from 'googleapis'
import { db } from '@/configs/db'
import { usersTable, emails } from '@/configs/schema'
import { eq, and, gt } from 'drizzle-orm'

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000

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

async function storeEmailsInDb(emailDetails, userId) {
  try {
    // Get the latest email date for this user
    const latestEmail = await db.query.emails.findFirst({
      where: eq(emails.userId, userId),
      orderBy: (emails, { desc }) => [desc(emails.date)]
    })

    // Filter out emails that are already in the database
    const newEmails = emailDetails.filter(email => 
      !latestEmail || new Date(email.date) > new Date(latestEmail.date)
    )

    if (newEmails.length === 0) {
      return []
    }

    // Batch insert new emails
    const [storedEmails] = await db
      .insert(emails)
      .values(
        newEmails.map(email => ({
          userId: userId,
          subject: email.subject,
          from: email.from,
          userEmail: email.userEmail,
          userName: email.userName,
          content: email.content,
          summary: email.summary,
          date: new Date(email.date),
          isNotImportant: false,
          isStudentAction: false,
          isCounsellorAction: false,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      )
      .onConflictDoUpdate({
        target: [emails.userId, emails.from, emails.date],
        set: {
          subject: email.subject,
          content: email.content,
          summary: email.summary,
          updatedAt: new Date()
        }
      })
      .returning()

    return storedEmails
  } catch (error) {
    console.error('Error storing emails in database:', error)
    throw error
  }
}

export async function fetchUserEmails(accessToken, userEmail) {
  try {
    // Check if we have recent emails in the database
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, userEmail)
    })

    if (!user) {
      throw new Error('User not found')
    }

    const recentEmails = await db.query.emails.findMany({
      where: and(
        eq(emails.userId, user.id),
        gt(emails.updatedAt, new Date(Date.now() - CACHE_DURATION))
      ),
      orderBy: (emails, { desc }) => [desc(emails.date)]
    })

    if (recentEmails.length > 0) {
      return recentEmails
    }

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
            const textPart = email.data.payload.parts.find(part => part.mimeType === 'text/plain')
            if (textPart && textPart.body.data) {
              content = Buffer.from(textPart.body.data, 'base64').toString('utf-8')
            }
          } else if (email.data.payload.body && email.data.payload.body.data) {
            content = Buffer.from(email.data.payload.body.data, 'base64').toString('utf-8')
          }

          return {
            subject: email.data.payload.headers.find(h => h.name === 'Subject')?.value || 'No Subject',
            from: email.data.payload.headers.find(h => h.name === 'From')?.value || 'Unknown',
            date: email.data.payload.headers.find(h => h.name === 'Date')?.value || 'Unknown',
            content: content,
            userEmail: userEmail,
            userName: user.name
          }
        })
      )

      // Store emails in database
      const storedEmails = await storeEmailsInDb(emailDetails, user.id)
      return storedEmails
    } catch (error) {
      if (error.code === 401) {
        // Token expired, try to refresh
        if (!user.refreshToken) {
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

export async function updateEmailStatus(emailId, changes) {
  'use server'
  
  try {
    const updateData = {
      isNotImportant: changes.isNotImportant ?? false,
      isStudentAction: changes.isStudentAction ?? false,
      isCounsellorAction: changes.isCounsellorAction ?? false,
      updatedAt: new Date()
    };

    const [updatedEmail] = await db
      .update(emails)
      .set(updateData)
      .where(eq(emails.id, emailId))
      .returning();

    return { success: true, email: updatedEmail };
  } catch (error) {
    console.error('Error updating email status:', error);
    return { success: false, error: error.message };
  }
} 