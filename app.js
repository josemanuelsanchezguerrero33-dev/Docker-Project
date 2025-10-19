const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// DB ENV
const DB_HOST = process.env.MYSQL_HOST || 'localhost';
const DB_USER = process.env.MYSQL_USER || 'root';
const DB_PASSWORD = process.env.MYSQL_PASSWORD || '';
const DB_NAME = process.env.MYSQL_DATABASE || 'appdb';

let pool;
async function initDb() {
  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  // quick ping
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
  console.log('✅ Connected to MySQL @', DB_HOST, 'DB:', DB_NAME);
}

// Simple health route
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'api', time: new Date().toISOString() });
});

// CRUD: tasks
// GET all
app.get('/api/tasks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, title, done, created_at FROM tasks ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});
// GET one
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, title, done, created_at FROM tasks WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});
// POST create
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'title required' });
  try {
    const [result] = await pool.execute('INSERT INTO tasks (title) VALUES (?)', [title.trim()]);
    const [rows] = await pool.query('SELECT id, title, done, created_at FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});
// PUT update
app.put('/api/tasks/:id', async (req, res) => {
  const { title, done } = req.body;
  try {
    const [existing] = await pool.query('SELECT id FROM tasks WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ error: 'Not found' });
    const fields = [];
    const values = [];
    if (typeof title === 'string') { fields.push('title = ?'); values.push(title.trim()); }
    if (typeof done !== 'undefined') { fields.push('done = ?'); values.push(!!done); }
    if (!fields.length) return res.status(400).json({ error: 'no fields to update' });
    values.push(req.params.id);
    await pool.execute(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await pool.query('SELECT id, title, done, created_at FROM tasks WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});
// DELETE
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Bootstrap
initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err.message);
    process.exit(1);
  });
