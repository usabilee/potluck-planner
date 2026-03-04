# 🍽️ Potluck Planner

A shareable potluck sign-up app. No user accounts needed — just create an event, share the link, and guests add their dishes.

---

## Stack

- **Backend:** Node.js + Express
- **Database:** SQLite (via `better-sqlite3`) — stored as a single `potluck.db` file
- **Frontend:** Vanilla HTML/CSS/JS (served as static files)

---

## Run Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Start the server
```bash
npm start
```

### 3. Open in browser
```
http://localhost:3000
```

For auto-restart on file changes during development:
```bash
npm run dev
# (requires: npm install -g nodemon)
```

---

## How It Works

1. **Host** goes to the homepage, enters an event name + optional description
2. A unique shareable URL is generated: `http://yoursite.com/event/a3f9b2c1d4`
3. **Host copies and shares** the link (text, email, group chat, etc.)
4. **Guests** open the link, see the current dish list, and add their own
5. Changes are live — anyone who refreshes sees the latest list

---

## Hosting Options

### ✅ Option 1: Railway (Recommended — free tier, easiest)
1. Push your code to a GitHub repo
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Railway auto-detects Node.js and runs `npm start`
4. Your app gets a public URL instantly (e.g. `https://potluck-planner.up.railway.app`)
5. The SQLite `.db` file persists on Railway's volume

### ✅ Option 2: Render (Free tier, straightforward)
1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service → connect repo
3. Build command: `npm install`
4. Start command: `node server.js`
5. Choose the free plan — spins down after inactivity, wakes on request

### ✅ Option 3: Fly.io (Free tier, more control)
```bash
npm install -g flyctl
fly auth login
fly launch        # follow prompts
fly deploy
```

### ✅ Option 4: VPS / DigitalOcean Droplet
```bash
# On your server:
git clone <your-repo>
cd potluck-planner
npm install
# Install pm2 to keep it running:
npm install -g pm2
pm2 start server.js --name potluck
pm2 save
```

---

## Project Structure

```
potluck-planner/
├── server.js          # Express API + SQLite
├── package.json
├── potluck.db         # Auto-created on first run (gitignore this)
├── public/
│   └── index.html     # Frontend (single page)
└── README.md
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/events` | Create a new event |
| GET | `/api/events/:id` | Get event + all items |
| POST | `/api/events/:id/items` | Add a dish to an event |
| DELETE | `/api/items/:id` | Remove a dish |

---

## .gitignore (recommended)

Create a `.gitignore` file with:
```
node_modules/
potluck.db
```
