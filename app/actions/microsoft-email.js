'use server'

import { Client } from '@microsoft/microsoft-graph-client'
import { db } from '@/configs/db'
import { usersTable, emails } from '@/configs/schema'
import { eq } from 'drizzle-orm'

async function refreshMicrosoftToken(refreshToken) {
  try {
    const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
        client_secret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to refresh Microsoft token')
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Error refreshing Microsoft token:', error)
    throw error
  }
}

async function storeEmailsInDb(emailDetails, userId) {
  try {
    // Store each email in the database
    const storedEmails = await Promise.all(
      emailDetails.map(async (email) => {
        const [storedEmail] = await db
          .insert(emails)
          .values({
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
          })
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

        return storedEmail
      })
    )

    return storedEmails
  } catch (error) {
    console.error('Error storing emails in database:', error)
    throw error
  }
}

export async function fetchMicrosoftEmails(accessToken, userEmail) {
  try {
    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken)
      }
    })

    try {
      // Get user from database
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, userEmail)
      })

      if (!user) {
        throw new Error('User not found')
      }

      const response = await client
        .api('/me/messages')
        .top(15)
        .select('subject,from,receivedDateTime,body')
        .get()

      const emailDetails = response.value.map(email => ({
        subject: email.subject || 'No Subject',
        from: email.from?.emailAddress?.address || 'Unknown',
        date: new Date(email.receivedDateTime).toLocaleString(),
        content: email.body?.content || 'No content available',
        userEmail: userEmail,
        userName: user.name
      }))

      // Store emails in database
      const storedEmails = await storeEmailsInDb(emailDetails, user.id)

      return storedEmails
    } catch (error) {
      if (error.statusCode === 401) {
        // Token expired, try to refresh
        const user = await db.query.usersTable.findFirst({
          where: eq(usersTable.email, userEmail)
        })

        if (!user || !user.refreshToken) {
          throw new Error('No refresh token available')
        }

        const newAccessToken = await refreshMicrosoftToken(user.refreshToken)
        
        // Update the user's access token in the database
        await db
          .update(usersTable)
          .set({
            accessToken: newAccessToken,
            updatedAt: new Date()
          })
          .where(eq(usersTable.email, userEmail))

        // Retry the request with the new token
        return fetchMicrosoftEmails(newAccessToken, userEmail)
      }
      throw error
    }
  } catch (error) {
    console.error('Error fetching Microsoft emails:', error)
    return []
  }
} 