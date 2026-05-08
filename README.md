# PhotoKeep

Photo digitization service — Vite + React + TypeScript + Tailwind + Supabase + Vercel.

## ⚠️ Supabase URL

Your `VITE_SUPABASE_URL` must be the project root — **without** `/rest/v1/`:

```
VITE_SUPABASE_URL=https://piupngxdwbkxfzatdvzv.supabase.co
```

The `supabase-js` client builds its own endpoint paths internally.

## Setup

**1. Install dependencies**

```bash
npm install
```

**2. Configure environment**

```bash
cp .env.example .env
# Edit .env and fill in your values
```

**3. Create Supabase table** (run in the Supabase SQL editor)

```sql
create table contact_responses (
  id uuid default gen_random_uuid() primary key,
  name text,
  phone text,
  email text,
  message text,
  created_at timestamptz default now()
);
```

**4. Set up CallMeBot WhatsApp**

- Send `I allow callmebot to send me messages` to **+34 644 35 79 00** on WhatsApp
- You'll receive your API key in reply
- Add your phone number (with country code, no `+`) and the API key to `.env`

**5. Add images to `public/assets/`**

| File | Used on |
|---|---|
| `photo-stack.jpg` | Home hero background |
| `holding.jpg` | Services page left column |
| `stack_of_photos.webp` | Contact page left column |
| `photos.jpeg` | Contact page fallback image |
| `shutter.png` | Navbar logo icon |
| `matteo.jpg` | About page polaroid |

Images are optional — pages render gracefully without them.

**6. Run locally**

```bash
npm run dev
```

**7. Deploy to Vercel**

- Push to GitHub
- Connect repo on [vercel.com](https://vercel.com)
- Add all four `VITE_` environment variables in the Vercel dashboard
- Deploy — `vercel.json` handles SPA routing automatically
