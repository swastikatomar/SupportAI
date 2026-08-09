import pool from '../config/db.js';

export async function createConversation(userId, title = 'New Conversation') {
  const { rows } = await pool.query(
    `INSERT INTO conversations (user_id, title)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, title]
  );
  return rows[0];
}

export async function findConversationsByUserId(userId) {
  const { rows } = await pool.query(
    `SELECT c.*, COUNT(m.id)::int AS message_count
     FROM conversations c
     LEFT JOIN messages m ON m.conversation_id = c.id
     WHERE c.user_id = $1
     GROUP BY c.id
     ORDER BY c.updated_at DESC`,
    [userId]
  );
  return rows;
}

export async function findConversationById(id, userId) {
  const { rows } = await pool.query(
    'SELECT * FROM conversations WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rows[0];
}

export async function updateConversationTimestamp(conversationId) {
  await pool.query(
    'UPDATE conversations SET updated_at = NOW() WHERE id = $1',
    [conversationId]
  );
}
export async function updateConversationTitle(conversationId, newTitle) {
  const { rows } = await pool.query(
    'UPDATE conversations SET title = $1 WHERE id = $2 RETURNING *',
    [newTitle, conversationId]
  );
  return rows[0];
}