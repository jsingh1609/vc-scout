# VCScout — VC Intelligence Interface

A precision AI scout for venture capital teams. Built with Next.js 14, Tailwind CSS, and OpenAI.

## Features

- **Companies** — Search, filter, sort table with pagination
- **Company Profile** — Overview, signals timeline, notes, save-to-list
- **Live Enrichment** — Click "Enrich" to fetch and analyze real public website content via AI
- **Lists** — Create curated lists, add/remove companies, export CSV or JSON
- **Saved Searches** — Save and re-run searches; bookmark companies

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-key-here
```

Get a key at: https://platform.openai.com/api-keys

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

In Vercel dashboard → Project → Settings → Environment Variables, add:
- `OPENAI_API_KEY` = your key

## Architecture

```
app/
  page.tsx              → Overview dashboard
  companies/
    page.tsx            → Companies table (search, filter, sort, paginate)
    [id]/page.tsx       → Company profile (signals, enrich, notes, lists)
  lists/page.tsx        → List management + CSV/JSON export
  saved/page.tsx        → Saved companies + saved searches
  api/
    enrich/route.ts     → SERVER-SIDE enrichment endpoint (keys never exposed)

lib/
  data.ts               → Mock company dataset + types

components/
  Sidebar.tsx           → Navigation
  Shell.tsx             → Layout wrapper
  GlobalSearch.tsx      → Header search bar
  ScoreBadge.tsx        → Thesis score display
```

## Enrichment API (safe)

The enrichment endpoint at `/api/enrich` runs **server-side only**:
1. Scrapes the company's public website (homepage, /about, /careers)
2. Strips HTML, extracts text
3. Sends to OpenAI GPT-4o-mini to extract: summary, bullets, keywords, derived signals
4. Returns structured JSON to the UI

Your API key is **never** sent to the browser. It only lives in server environment variables.

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** (custom dark theme)
- **OpenAI GPT-4o-mini** (enrichment)
- **localStorage** (lists, saved searches, notes, enrichment cache)
- **Vercel** (deployment)
