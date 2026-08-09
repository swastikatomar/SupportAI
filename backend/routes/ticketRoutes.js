import { Router } from 'express';
import {
  createTicket,
  listTickets,
  getTicketById,
} from '../controllers/ticketController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, createTicket);
router.get('/', authenticate, listTickets);
router.get('/:id', authenticate, getTicketById);

export default router;
