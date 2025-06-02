import { client } from '@/configs/Ai';

const MAX_TOKENS_PER_REQUEST = 4000; // Adjust based on your LLM's context limit

export async function processEmailThroughLLM(email) {
  try {
    // Prepare the email content for the LLM
    const emailContent = `
      Subject: ${email.subject}
      From: ${email.from}
      Date: ${email.date}
      Content: ${email.content || 'No content available'}
    `;

    // Ensure we don't exceed token limits
    const truncatedContent = emailContent.slice(0, MAX_TOKENS_PER_REQUEST);

    const completion = await client.chat.completions.create({
      model: "grok-3",
      messages: [
        { 
          role: "system", 
          content: "You are an email summarizer. Provide a concise, informative summary of the email content. Focus on key points, action items, and important details. Keep the summary under 100 words." 
        },
        { 
          role: "user", 
          content: truncatedContent 
        }
      ],
      max_tokens: 150, // Limit response length
      temperature: 0.7, // Add some creativity but keep it focused
    });

    const summary = completion.choices[0]?.message?.content || 'No summary available';

    return {
      ...email,
      summary: summary.trim()
    };
  } catch (error) {
    console.error('Error processing email through LLM:', error);
    return {
      ...email,
      summary: 'Failed to generate summary. Please try again later.'
    };
  }
}

export async function processEmailsInBatches(emails, batchSize = 5) {
  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return [];
  }

  const processedEmails = [];
  
  // Process emails in batches to avoid overwhelming the LLM
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    try {
      const batchPromises = batch.map(email => processEmailThroughLLM(email));
      const processedBatch = await Promise.all(batchPromises);
      processedEmails.push(...processedBatch);
    } catch (error) {
      console.error(`Error processing batch ${i / batchSize + 1}:`, error);
      // Continue with next batch even if current batch fails
      continue;
    }
  }

  return processedEmails;
} 