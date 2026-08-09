import { handleChat } from '../services/chatService.js';

export async function sendMessage(req, res, next) {
  try {
    const result = await handleChat(req.user.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
