import { client } from '@/configs/Ai';
import { db } from '@/configs/db';
import { emails } from '@/configs/schema';
import { eq, and } from 'drizzle-orm';

const MAX_TOKENS_PER_REQUEST = 4000; // Adjust based on your LLM's context limit
const BATCH_SIZE = 5;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function processEmailThroughLLM(email) {
  try {
    // Check if we have a recent summary in the database
    const existingEmail = await db.query.emails.findFirst({
      where: (emails) => and(
        eq(emails.userId, email.userId),
        eq(emails.from, email.from),
        eq(emails.date, new Date(email.date))
      )
    });

    if (existingEmail?.summary && 
        new Date(existingEmail.updatedAt) > new Date(Date.now() - CACHE_DURATION)) {
      return {
        ...email,
        summary: existingEmail.summary
      };
    }

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

    // Update the email in the database with the new summary
    if (existingEmail) {
      await db
        .update(emails)
        .set({
          summary: summary.trim(),
          updatedAt: new Date()
        })
        .where(eq(emails.id, existingEmail.id));
    }

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

export async function processEmailsInBatches(emails, batchSize = BATCH_SIZE) {
  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return [];
  }

  // Filter out emails that already have recent summaries
  const emailsToProcess = await Promise.all(
    emails.map(async (email) => {
      try {
        const existingEmail = await db.query.emails.findFirst({
          where: (emails) => and(
            eq(emails.userId, email.userId),
            eq(emails.from, email.from),
            eq(emails.date, new Date(email.date))
          )
        });

        if (existingEmail?.summary && 
            new Date(existingEmail.updatedAt) > new Date(Date.now() - CACHE_DURATION)) {
          return {
            ...email,
            summary: existingEmail.summary
          };
        }
        return email;
      } catch (error) {
        console.error('Error checking existing email:', error);
        return email;
      }
    })
  );

  const emailsNeedingProcessing = emailsToProcess.filter(email => !email.summary);
  const processedEmails = [...emailsToProcess.filter(email => email.summary)];
  
  // Process remaining emails in batches
  for (let i = 0; i < emailsNeedingProcessing.length; i += batchSize) {
    const batch = emailsNeedingProcessing.slice(i, i + batchSize);
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