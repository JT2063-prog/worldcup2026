# 🏆 FIFA World Cup 2026 — Group Stage Tracker

A React app showing all 12 groups with fixtures, live scores, red cards, standings, country flags, and football association emblems — all times in **AEST (UTC+10)**.

## Features
- All 12 groups (A–L), 72 group stage matches
- **Live scores** via [wc2026api.com](https://www.wc2026api.com) (free tier, 100 req/day)
- AEST kickoff times
- Country flags **+** Football Association emblems for all 48 teams
- Red card indicators
- Standings table with live GD/PTS updates
- Live match phase indicator (1H / HT / 2H / FT)
- Group filter + per-group Matches/Table tab
- Fully responsive mobile layout

---

## Deploy to Render

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "World Cup 2026 tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/worldcup2026.git
git push -u origin main
```

### 2. Create Render Static Site

1. Go to [render.com](https://render.com) → **New → Static Site**
2. Connect your GitHub repo — `render.yaml` auto-configures everything
3. Click **Create Static Site** — done ✅

Your site will be live at `https://worldcup2026.onrender.com` (or similar). Every `git push` triggers an auto-redeploy.

---

## Live Score Setup (in the browser)

1. Get a **free API key** at [wc2026api.com](https://www.wc2026api.com) (100 req/day free)
2. In the app, click the **⚪ Static** button in the top-right header
3. Paste your key and click **Save**
4. The app will start polling every 60 seconds — key stored in your browser only

> The free tier allows ~1.4 requests per hour — plenty for match days. During a live game you'll see goals, red cards and phase updates (1H / HT / 2H / FT) within 60 seconds.

---

## Run Locally

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## Manual Score Updates (no API)

Edit `src/data.js`, find the match by ID, change `null, null` to the score:

```js
M('A1', 'A', 'MEX', 'RSA', '2026-06-11', '15:00', 2, 0, 0, 0, ...)
//                                                   ↑  ↑  ↑  ↑
//                                             home away homeRed awayRed
```

Then `git push` — Render redeploys in ~60 seconds.

---

## Tech Stack
- React 18 (Create React App)
- No backend — pure static site
- FA emblems via Wikimedia CDN
- Live scores via wc2026api.com REST API
- Barlow Condensed + Inter (Google Fonts)
