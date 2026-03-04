const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ── DATABASE SETUP ──
const db = new Database(path.join(__dirname, 'potluck.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id TEXT NOT NULL,
    person_name TEXT NOT NULL,
    dish_name TEXT NOT NULL,
    emoji TEXT NOT NULL,
    note TEXT,
    added_at INTEGER NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
  );
`);

// ── MIDDLEWARE ──
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── HELPERS ──
function makeId() {
  return crypto.randomBytes(5).toString('hex'); // e.g. "a3f9b2c1d4"
}

// ── API ROUTES ──

// Create a new event
app.post('/api/events', (req, res) => {
  const { name, description } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Event name is required' });
  }
  const id = makeId();
  db.prepare(
    'INSERT INTO events (id, name, description, created_at) VALUES (?, ?, ?, ?)'
  ).run(id, name.trim(), (description || '').trim(), Date.now());
  res.json({ id });
});

// Get event + items
app.get('/api/events/:id', (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  const items = db.prepare(
    'SELECT * FROM items WHERE event_id = ? ORDER BY added_at ASC'
  ).all(req.params.id);
  res.json({ ...event, items });
});

// Add an item to an event
app.post('/api/events/:id/items', (req, res) => {
  const event = db.prepare('SELECT id FROM events WHERE id = ?').get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  const { person_name, dish_name, emoji, note } = req.body;
  if (!person_name || !dish_name) {
    return res.status(400).json({ error: 'Name and dish are required' });
  }
  const result = db.prepare(
    'INSERT INTO items (event_id, person_name, dish_name, emoji, note, added_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.params.id, person_name.trim(), dish_name.trim(), emoji || '🍴', (note || '').trim(), Date.now());
  res.json({ id: result.lastInsertRowid });
});

// Delete an item
app.delete('/api/items/:id', (req, res) => {
  const result = db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Item not found' });
  res.json({ ok: true });
});

// ── CATCH-ALL: serve index.html for /event/:id routes ──
app.get('/event/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── START ──
app.listen(PORT, () => {
  console.log(`\n🍽️  Potluck Planner running at http://localhost:${PORT}\n`);
});
