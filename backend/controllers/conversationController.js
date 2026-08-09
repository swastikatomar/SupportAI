import { findConversationsByUserId } from '../models/Conversation.js';
import { getConversationWithMessages } from '../services/chatService.js';

export async function listConversations(req, res, next) {
  try {
    const conversations = await findConversationsByUserId(req.user.id);
    res.json({ conversations });
  } catch (err) {
    next(err);
  }
}

export async function getConversation(req, res, next) {
  try {
    const conversation = await getConversationWithMessages(
      req.params.id,
      req.user.id
    );
    res.json({ conversation });
  } catch (err) {
    next(err);
  }
}
