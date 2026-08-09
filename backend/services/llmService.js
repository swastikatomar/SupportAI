import { config } from '../config/env.js';

export async function generateResponse(userMessage, contextDocuments) {
  const context = contextDocuments
    .map((doc) => `[${doc.title}]\n${doc.content}`)
    .join('\n\n');

  const systemPrompt = `You are a helpful customer support assistant for SupportAI.
Use the following company knowledge base to answer questions accurately.
If the information is not in the knowledge base, politely say you don't have that information and suggest creating a support ticket.

Knowledge Base:
${context || 'No relevant documents found.'}`;

  if (!config.llm.apiKey) {
    return getFallbackResponse(userMessage, contextDocuments);
  }

  try {
    const response = await fetch(`${config.llm.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.llm.apiKey}`,
      },
      body: JSON.stringify({
        model: config.llm.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('LLM service error:', error.message);
    return getFallbackResponse(userMessage, contextDocuments);
  }
}

function getFallbackResponse(userMessage, contextDocuments) {
  if (contextDocuments.length > 0) {
    const doc = contextDocuments[0];
    return `Based on our knowledge base (${doc.title}): ${doc.content}\n\nIf this doesn't resolve your issue, please create a support ticket for further assistance.`;
  }

  return `Thank you for your question: "${userMessage}". I couldn't find specific information in our knowledge base. Please create a support ticket and our team will assist you shortly.`;
}
