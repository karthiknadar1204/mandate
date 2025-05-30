'use server'

import { google } from 'googleapis'

export async function fetchUserEmails(accessToken) {
  try {
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: accessToken })
    
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
    
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
      format: 'full'
    })

    const messages = response.data.messages || []
    const emailDetails = await Promise.all(
      messages.map(async (message) => {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        })
        return {
          subject: email.data.payload.headers.find(h => h.name === 'Subject')?.value || 'No Subject',
          from: email.data.payload.headers.find(h => h.name === 'From')?.value || 'Unknown',
          date: email.data.payload.headers.find(h => h.name === 'Date')?.value || 'Unknown',
        }
      })
    )

    return emailDetails
  } catch (error) {
    console.error('Error fetching emails:', error)
    return []
  }
} 