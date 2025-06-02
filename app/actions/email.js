'use server'

import { google } from 'googleapis'

export async function fetchUserEmails(accessToken) {
  try {
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: accessToken })
    
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
    
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
    console.error('Error fetching emails:', error)
    return []
  }
} 