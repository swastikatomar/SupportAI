import { searchKnowledgeBase } from '../models/KnowledgeBase.js';
import { generateResponse } from './llmService.js';

export async function processChatMessage(userMessage) {
  const relevantDocs = await searchKnowledgeBase(userMessage);
  const aiResponse = await generateResponse(userMessage, relevantDocs);

  return {
    response: aiResponse,
    sources: relevantDocs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      category: doc.category,
    })),
  };
}
