# Canadian International School Tangier — website

Public website and admin panel for CIST (https://cist.ma).

- **Public site** (`/`): trilingual (English, French, Spanish) React single-page app.
- **Pre-registration** (`/enroll`), **Privacy** (`/privacy`), **Terms** (`/terms`).
- **Admin panel** (`/admin-panel`, `/admin` redirects): one admin account manages news, events, gallery, page images, all texts, school info, seasonal themes and the photo library.

## Stack

- React 18 + Vite 4, plain CSS (`src/styles.css`, `src/components/landing.css`, `src/pages/admin/admin.css`)
- Supabase: database (content), storage (`website-images` bucket) and admin sign-in
- EmailJS: sends the contact and pre-registration forms to the school
- i18next: translations in `src/i18n/*.json` (admins can override any text from the panel)
- Fonts (Inter, Playfair Display) are self-hosted in `public/fonts` via `src/fonts.css`; no Google Fonts requests
- Google Maps loads only after the visitor clicks "Show map" (privacy)

## Getting started

```bash
npm install
cp .env.example .env   # then fill in the values (see below)
npm run dev            # http://localhost:3000
```

| Variable | Where to find it |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → **anon / publishable** key (never the service_role key) |
| `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` | EmailJS dashboard |

All `VITE_*` values end up in the public JavaScript, so only public/client keys belong here.

## Supabase setup

1. Run `supabase/setup.sql` in the Supabase SQL Editor. It is safe to run again: it creates the tables
   (`news_items`, `upcoming_events`, `gallery_photos`, `site_content`), row-level security (everyone can read,
   only a signed-in user can write), the picture bucket, and copies the built-in content into empty tables.
2. Authentication → Users: create the admin account.
3. Authentication → Sign In / Providers: turn **off** "Allow new users to sign up" (otherwise anyone could
   create an account and edit the website).
4. Authentication → URL Configuration: add `https://cist.ma/admin-panel` (and `http://localhost:3000/admin-panel`)
   to the redirect URLs so password-reset emails work.

## Build and deploy

```bash
npm run build      # outputs dist/
npm run preview    # serves the production build locally
```

- **Hostinger (Apache):** upload the contents of `dist/` to `public_html`, including the hidden `.htaccess`
  (single-page routing, security headers, caching).
- **Netlify:** `netlify.toml` contains the equivalent build, redirect and header settings. Set the environment
  variables in the Netlify dashboard, because `.env` is not committed.

## Where things live

| Path | What |
| --- | --- |
| `src/App.jsx` | Routes; secondary pages are lazy-loaded |
| `src/components/` | Home page sections |
| `src/pages/admin/` | Admin panel sections and shared UI |
| `src/lib/cmsData.js` | Reads/writes news, events, gallery, pictures and site content |
| `src/lib/siteContent.jsx` | Applies admin edits (images, school info, texts, theme) to the site |
| `src/lib/defaultContent.js` | Built-in content used before the admin edits anything, or if Supabase is unreachable |
| `src/lib/themes.js` | Seasonal themes (Halloween, Ramadan, Eid, Back to school) |
| `supabase/setup.sql` | Database and storage setup |
