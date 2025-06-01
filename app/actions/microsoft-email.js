'use server'

import { Client } from '@microsoft/microsoft-graph-client'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials'

export async function fetchMicrosoftEmails(accessToken) {
  try {
    const authProvider = new TokenCredentialAuthenticationProvider({
      getAccessToken: async () => accessToken
    })

    const client = Client.init({
      authProvider,
      defaultVersion: 'v1.0'
    })

    const response = await client
      .api('/me/messages')
      .top(10)
      .select('subject,from,receivedDateTime')
      .get()

    const emailDetails = response.value.map(email => ({
      subject: email.subject || 'No Subject',
      from: email.from?.emailAddress?.address || 'Unknown',
      date: new Date(email.receivedDateTime).toLocaleString()
    }))

    return emailDetails
  } catch (error) {
    console.error('Error fetching Microsoft emails:', error)
    return []
  }
} 