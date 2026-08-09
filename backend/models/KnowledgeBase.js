import pool from '../config/db.js';

export async function searchKnowledgeBase(query, limit = 5) {
  // Split the user's sentence into individual words and filter out tiny words
  const words = query.trim().split(/\s+/).filter(w => w.length > 2);
  
  if (words.length === 0) {
    const { rows } = await pool.query(
      `SELECT id, title, content, category FROM knowledge_base LIMIT $1`,
      [limit]
    );
    return rows;
  }

  // Build dynamic conditions to match any of the significant keywords
  const conditions = words.map((_, i) => 
    `(title ILIKE $${i + 1} OR content ILIKE $${i + 1} OR category ILIKE $${i + 1})`
  ).join(' OR ');

  const params = words.map(w => `%${w}%`);
  params.push(limit);

  const { rows } = await pool.query(
    `SELECT id, title, content, category
     FROM knowledge_base
     WHERE ${conditions}
     LIMIT $${params.length}`,
    params
  );
  
  return rows;
}

export async function getAllKnowledgeBase() {
  const { rows } = await pool.query(
    'SELECT id, title, content, category FROM knowledge_base ORDER BY category, title'
  );
  return rows;
}
