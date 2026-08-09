import { Router } from 'express';
import {
  listConversations,
  getConversation,
} from '../controllers/conversationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, listConversations);
router.get('/:id', authenticate, getConversation);

export default router;
