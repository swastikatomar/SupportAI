import {
  createConversation,
  findConversationById,
  updateConversationTimestamp,
  updateConversationTitle,
} from '../models/Conversation.js';
import { createMessage, findMessagesByConversationId } from '../models/Message.js';
import { processChatMessage } from './ragService.js';

export async function handleChat(userId, { message, conversationId }) {
  if (!message?.trim()) {
    const error = new Error('Message is required');
    error.status = 400;
    throw error;
  }

  const lowerMessage = message.toLowerCase().trim();
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "greetings"];
  const isGreeting = greetings.includes(lowerMessage);

  let conversation;

  if (conversationId) {
    conversation = await findConversationById(conversationId, userId);
    if (!conversation) {
      const error = new Error('Conversation not found');
      error.status = 404;
      throw error;
    }
    
    // If the title is generic, update it to the user's actual question!
    if (!isGreeting && (conversation.title === "New Conversation" || greetings.includes(conversation.title.toLowerCase().trim()))) {
      const newTitle = message.slice(0, 50) + (message.length > 50 ? '...' : '');
      await updateConversationTitle(conversation.id, newTitle);
      conversation.title = newTitle;
    }
  } else {
    const title = isGreeting ? "New Conversation" : (message.slice(0, 50) + (message.length > 50 ? '...' : ''));
    conversation = await createConversation(userId, title);
  }

  // Handle greeting response directly if it's a greeting
  if (isGreeting) {
    await createMessage({
      conversationId: conversation.id,
      role: 'user',
      content: message,
    });

    const greetingResponse = "Hello! Welcome to SupportAI. How can I help you with your order, shipping, or support questions today?";
    const assistantMessage = await createMessage({
      conversationId: conversation.id,
      role: 'assistant',
      content: greetingResponse,
    });

    await updateConversationTimestamp(conversation.id);

    return {
      conversationId: conversation.id,
      message: assistantMessage,
      sources: [],
    };
  }

  // --- Normal RAG & AI Chat Flow ---
  await createMessage({
    conversationId: conversation.id,
    role: 'user',
    content: message,
  });

  const { response, sources } = await processChatMessage(message);

  const assistantMessage = await createMessage({
    conversationId: conversation.id,
    role: 'assistant',
    content: response,
  });

  await updateConversationTimestamp(conversation.id);

  return {
    conversationId: conversation.id,
    message: assistantMessage,
    sources,
  };
}

export async function getConversationWithMessages(conversationId, userId) {
  const conversation = await findConversationById(conversationId, userId);
  if (!conversation) return null;
  const messages = await findMessagesByConversationId(conversationId);
  return { ...conversation, messages };
}