-- CIST website — database and storage setup
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to run again: it only creates what is missing and replaces its own policies.
--
-- Access model: the website is public to read; only a signed-in user can change it.
-- The only account is the school admin, created in Authentication → Users.
-- IMPORTANT: turn OFF public sign-ups (Authentication → Sign In / Providers → "Allow new users to sign up"),
-- otherwise anyone could create an account and edit the website.

-- Remove the earlier admin allowlist if a previous version of this script created it
drop function if exists public.is_site_admin() cascade;
drop table if exists public.site_admins;

-- ---------------------------------------------------------------------------
-- 1. Content tables (columns match src/lib/cmsData.js)
-- ---------------------------------------------------------------------------
create table if not exists public.news_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);
alter table public.news_items
  add column if not exists title text,
  add column if not exists category text,
  add column if not exists "categoryLabel" text,
  add column if not exists date text,
  add column if not exists "readTime" text,
  add column if not exists excerpt text,
  add column if not exists author text,
  add column if not exists image text,
  add column if not exists content text,
  add column if not exists sort_order integer;

create table if not exists public.upcoming_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);
alter table public.upcoming_events
  add column if not exists date text,
  add column if not exists title text,
  add column if not exists time text,
  add column if not exists pinned boolean not null default false;

create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);
alter table public.gallery_photos
  add column if not exists src text,
  add column if not exists title text,
  add column if not exists category text;

-- Page images, school info and text edits made in the admin panel (one row per key)
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Row level security: everyone can read, only the signed-in admin can write
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['news_items', 'upcoming_events', 'gallery_photos', 'site_content'] loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "Public can read" on public.%I', t);
    execute format('drop policy if exists "Admin can insert" on public.%I', t);
    execute format('drop policy if exists "Admin can update" on public.%I', t);
    execute format('drop policy if exists "Admin can delete" on public.%I', t);

    execute format('create policy "Public can read" on public.%I for select using (true)', t);
    execute format('create policy "Admin can insert" on public.%I for insert to authenticated with check (true)', t);
    execute format('create policy "Admin can update" on public.%I for update to authenticated using (true) with check (true)', t);
    execute format('create policy "Admin can delete" on public.%I for delete to authenticated using (true)', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 3. Picture storage: public bucket, only the signed-in admin can upload/delete
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('website-images', 'website-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view website images" on storage.objects;
drop policy if exists "Admin can upload website images" on storage.objects;
drop policy if exists "Admin can update website images" on storage.objects;
drop policy if exists "Admin can delete website images" on storage.objects;

create policy "Public can view website images" on storage.objects
  for select using (bucket_id = 'website-images');

create policy "Admin can upload website images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'website-images');

create policy "Admin can update website images" on storage.objects
  for update to authenticated
  using (bucket_id = 'website-images')
  with check (bucket_id = 'website-images');

create policy "Admin can delete website images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'website-images');

-- ---------------------------------------------------------------------------
-- 4. Starting content: copies the website's current news, events and gallery
--    into the database, but only into tables that are still empty.
-- ---------------------------------------------------------------------------
insert into public.news_items (title, category, "categoryLabel", date, "readTime", excerpt, author, image, content, created_at)
select * from (values
  ('CIST × Baraat Al Boughaz — Recreational Day at Medina Forest', 'events', 'Event', 'May 21, 2026', '3 min', 'CIST partnered with Baraat Al Boughaz Association to organise a fun-filled outdoor day for our students at Medina Forest.', 'Admin Office', '/images/events/collab.webp', 'On Thursday, May 21, 2026, CIST students enjoyed a special recreational day at Medina Forest in collaboration with the Baraat Al Boughaz Association. The programme was packed with activities designed to nurture teamwork, creativity, and joy — including flag salute, sports competitions, group games, a shared breakfast, artistic creations, a drawing competition, and an educational nature lab. It was a wonderful day that brought our school community closer together while connecting students with the beautiful natural environment of Tangier.', now() - interval '4 seconds'),
  ('CIST Students Win Ramadan Mini Football Tournament', 'achievements', 'Achievement', 'March 20, 2024', '3 min', 'Our students beat competing schools and brought home the championship trophy from the Ramadan Mini Football Tournament.', 'Coach Yassir', '/images/events/sport10.webp', 'Congratulations to our amazing students for winning the Ramadan Mini Football Tournament! CIST faced off against several other schools in a thrilling competition, and our team rose to the challenge with exceptional skill, teamwork, and sportsmanship. Competing against strong opponents, they delivered outstanding performances in every match. This victory is a testament to their dedication and hard work in training. We are incredibly proud of their achievement!', now() - interval '3 seconds'),
  ('Student Wins National Robotics Competition', 'achievements', 'Achievement', 'April 15, 2024', '3 min', 'One of our talented students brought home the trophy from the National Robotics Championship.', 'Dr. Sarah Ahmed', '/images/events/achievment1.webp', 'We are thrilled to announce that one of our outstanding students has won the National Robotics Competition! This remarkable achievement showcases the excellence of our STEM and robotics program. The student demonstrated exceptional programming skills, engineering creativity, and problem-solving abilities. Congratulations to our champion!', now() - interval '2 seconds'),
  ('Holidays 2027 - Canadian International School Tangier', 'announcements', 'Announcement', 'June 1, 2026', '4 min', 'View all school holidays, breaks, and important dates for the 2027 academic year at CIST.', 'Admin Office', '/images/events/Holidays.webp', 'The holidays calendar for 2027 is now available for Canadian International School Tangier. Plan your family vacations and important events around school holidays, breaks, and professional development days.', now() - interval '1 seconds')
) as seed(title, category, "categoryLabel", date, "readTime", excerpt, author, image, content, created_at)
where not exists (select 1 from public.news_items);

insert into public.upcoming_events (date, title, time, created_at)
select * from (values
  ('Jun 19', 'Graduation Ceremony', '10:00 AM - 2:00 PM', now() - interval '2 seconds'),
  ('May 20', 'School Trip', 'All Day', now() - interval '1 seconds')
) as seed(date, title, time, created_at)
where not exists (select 1 from public.upcoming_events);

insert into public.gallery_photos (src, title, category, created_at)
select * from (values
  ('/images/art/art-5.webp', 'Art Gallery', 'arts', now() - interval '34 seconds'),
  ('/images/art/art-2.webp', 'Visual Arts', 'arts', now() - interval '33 seconds'),
  ('/images/art/art-1.webp', 'Art Exhibition', 'arts', now() - interval '32 seconds'),
  ('/images/academy/art-4.webp', 'Classroom', 'academics', now() - interval '31 seconds'),
  ('/images/academy/graduation0.webp', 'Graduation Day', 'academics', now() - interval '30 seconds'),
  ('/images/academy/graduation3.webp', 'Class of 2024', 'academics', now() - interval '29 seconds'),
  ('/images/academy/graduation2.webp', 'Graduation Ceremony', 'academics', now() - interval '28 seconds'),
  ('/images/academy/graduation1.webp', 'Graduation Celebration', 'academics', now() - interval '27 seconds'),
  ('/images/community/community%20(6).webp', 'Special Needs Workshop', 'community', now() - interval '26 seconds'),
  ('/images/community/community%20(5).webp', 'Special Needs Workshop', 'community', now() - interval '25 seconds'),
  ('/images/community/community%20(4).webp', 'Special Needs Workshop', 'community', now() - interval '24 seconds'),
  ('/images/community/community%20(3).webp', 'Special Needs Workshop', 'community', now() - interval '23 seconds'),
  ('/images/community/community%20(2).webp', 'Special Needs Workshop', 'community', now() - interval '22 seconds'),
  ('/images/community/community.webp', 'Special Needs Workshop', 'community', now() - interval '21 seconds'),
  ('/images/community/kids1.webp', 'Kids Activities', 'community', now() - interval '20 seconds'),
  ('/images/community/graduation4.jpg', 'Community', 'community', now() - interval '19 seconds'),
  ('/images/community/students.webp', 'Community', 'community', now() - interval '18 seconds'),
  ('/images/community/easter1.webp', 'Easter Celebration', 'community', now() - interval '17 seconds'),
  ('/images/sport/sport12.webp', 'Inter School Football', 'sports', now() - interval '16 seconds'),
  ('/images/sport/sport11.webp', 'Football Match', 'sports', now() - interval '15 seconds'),
  ('/images/sport/sport10.webp', 'Football Tournament', 'sports', now() - interval '14 seconds'),
  ('/images/sport/sport9.webp', 'Football Championship', 'sports', now() - interval '13 seconds'),
  ('/images/sport/sport8.webp', 'Football Practice', 'sports', now() - interval '12 seconds'),
  ('/images/sport/sport7.webp', 'Football Training', 'sports', now() - interval '11 seconds'),
  ('/images/sport/sport6.webp', 'Football Competition', 'sports', now() - interval '10 seconds'),
  ('/images/sport/sport5.webp', 'Football Finals', 'sports', now() - interval '9 seconds'),
  ('/images/sport/sport4.webp', 'Football Game', 'sports', now() - interval '8 seconds'),
  ('/images/sport/sport3.webp', 'Football Championship', 'sports', now() - interval '7 seconds'),
  ('/images/sport/sport2.webp', 'Football Match', 'sports', now() - interval '6 seconds'),
  ('/images/sport/sport1.webp', 'Football Tournament', 'sports', now() - interval '5 seconds'),
  ('/images/sport/team%20C.webp', 'Team C', 'sports', now() - interval '4 seconds'),
  ('/images/sport/plan1.webp', 'Game Plan', 'sports', now() - interval '3 seconds'),
  ('/images/sport/plan.webp', 'Team Strategy', 'sports', now() - interval '2 seconds'),
  ('/images/sport/match.webp', 'Football Match', 'sports', now() - interval '1 seconds')
) as seed(src, title, category, created_at)
where not exists (select 1 from public.gallery_photos);
