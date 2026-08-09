import { createTicket, findTicketsByUserId, findTicketById } from '../models/Ticket.js';

export async function createSupportTicket(userId, { subject, description, conversationId }) {
  if (!subject?.trim() || !description?.trim()) {
    const error = new Error('Subject and description are required');
    error.status = 400;
    throw error;
  }

  return createTicket({
    userId,
    conversationId,
    subject: subject.trim(),
    description: description.trim(),
  });
}

export async function getUserTickets(userId) {
  return findTicketsByUserId(userId);
}

export async function getTicket(userId, ticketId) {
  const ticket = await findTicketById(ticketId, userId);
  if (!ticket) {
    const error = new Error('Ticket not found');
    error.status = 404;
    throw error;
  }
  return ticket;
}
