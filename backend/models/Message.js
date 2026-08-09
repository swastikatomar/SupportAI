import pool from '../config/db.js';

export async function createMessage({ conversationId, role, content }) {
  const { rows } = await pool.query(
    `INSERT INTO messages (conversation_id, role, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [conversationId, role, content]
  );
  return rows[0];
}

export async function findMessagesByConversationId(conversationId) {
  const { rows } = await pool.query(
    'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
    [conversationId]
  );
  return rows;
}
