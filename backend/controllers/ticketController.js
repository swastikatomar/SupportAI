import {
  createSupportTicket,
  getUserTickets,
  getTicket,
} from '../services/ticketService.js';

export async function createTicket(req, res, next) {
  try {
    const ticket = await createSupportTicket(req.user.id, req.body);
    res.status(201).json({ ticket });
  } catch (err) {
    next(err);
  }
}

export async function listTickets(req, res, next) {
  try {
    const tickets = await getUserTickets(req.user.id);
    res.json({ tickets });
  } catch (err) {
    next(err);
  }
}

export async function getTicketById(req, res, next) {
  try {
    const ticket = await getTicket(req.user.id, req.params.id);
    res.json({ ticket });
  } catch (err) {
    next(err);
  }
}
