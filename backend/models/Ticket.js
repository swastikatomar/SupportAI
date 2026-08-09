import pool from '../config/db.js';

export async function createTicket({ userId, conversationId, subject, description }) {
  const { rows } = await pool.query(
    `INSERT INTO tickets (user_id, conversation_id, subject, description)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, conversationId || null, subject, description]
  );
  return rows[0];
}

export async function findTicketsByUserId(userId) {
  const { rows } = await pool.query(
    'SELECT * FROM tickets WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows;
}

export async function findTicketById(id, userId) {
  const { rows } = await pool.query(
    'SELECT * FROM tickets WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rows[0];
}
