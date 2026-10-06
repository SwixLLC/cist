# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Families and prospective families** visit the public website of Canadian International School Tangier (CIST) to learn about the school, read news and events, browse campus life, and start enrollment.
- **The school admin (non-technical, a single account in Supabase Auth)** uses the admin panel at `/admin-panel` to publish news articles, upcoming events and campus gallery photos, and to upload pictures. They work mostly from an office computer, sometimes from a phone at a school event. No other staff accounts exist, and public sign-up is disabled. The admin should never need to know about Supabase, buckets, tables or URLs.

## Product Purpose
The public site is the school's front door: trustworthy, warm and clear. The admin panel lets the admin keep that site current without a developer.

## Operating Context
- Content lives in Supabase (`news_items`, `upcoming_events`, `gallery_photos`, `site_content` tables and the `website-images` storage bucket); built-in defaults in `src/lib/defaultContent.js` are used only if Supabase can't be reached.
- Event dates display on the public site as `Mon D` (e.g. "Jun 19"); news dates as long dates (e.g. "October 15, 2026").
- Hosted on Hostinger (Apache) — SPA routing handled by `public/.htaccess`.

## Capabilities and Constraints
- Admin: sign in, reset/change password, upload/delete pictures, create/edit/delete/order news, events (with a pinned event) and gallery photos, edit page images, all texts (EN/FR/ES), school info and seasonal themes.
- Stack: React 18 + Vite, plain CSS, lucide-react icons, framer-motion available. No new UI dependencies without reason.
- Public site is trilingual via i18next; the admin panel is English-only.

## Brand Commitments
- Name: Canadian International School Tangier (CIST). Logo at `public/images/logo.webp`.
- Canadian red (`#D32F2F`) is the brand accent; fonts are Inter (UI/body) and Playfair Display (headings).
- The admin panel should feel like part of CIST, matching the school brand.

## Product Principles
1. Plain language over system language: the admin sees "photos" and "articles", never "buckets" or "rows".
2. Hard to break: destructive actions confirm, saves report honestly whether they reached the live site.
3. Pick, don't paste: images are chosen or uploaded in place, not copied as URLs.
4. Works on a phone as well as a desktop.
