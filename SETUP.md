# Pugh Family Calendar — Setup

Single-file PWA, same stack as Pugh Family Dinners: vanilla JS, Supabase realtime sync, offline cache, homescreen install. Reuses the **same Supabase project** as the meal app (`iwfbmlzffnojsqmwmnvn`), just a new table.

## What works right away
The app runs **local-only** until the Supabase table exists (graceful fallback — sync indicator shows ⚠ Offline). It's already seeded with everything from the Upcoming Calendar doc.

## Step 1 — Create the Supabase table (one paste, ~30 sec)
In the Supabase dashboard → **SQL Editor** → New query → paste and Run:

```sql
create table if not exists calendar_events (
  id          text primary key,
  title       text not null,
  start_date  date not null,
  end_date    date,
  category    text default 'Other',
  who         text,
  event_time  text,
  location    text,
  notes       text,
  updated_at  timestamptz default now()
);

alter table calendar_events enable row level security;

create policy "anon read"   on calendar_events for select using (true);
create policy "anon insert" on calendar_events for insert with check (true);
create policy "anon update" on calendar_events for update using (true) with check (true);
create policy "anon delete" on calendar_events for delete using (true);

alter publication supabase_realtime add table calendar_events;
```

First device to open the app after this runs will push the seed events up; the second device pulls them. (Stable seed IDs mean no duplicates.)

## Step 2 — Deploy (GitHub Pages)
Repo: `github.com/pepelespokane/pugh-calendar` (created/pushed by Claude).
In repo **Settings → Pages → Build from branch → `main` / root → Save**.
Live URL: `https://pepelespokane.github.io/pugh-calendar/`

## Step 3 — Add to homescreen (both phones)
Safari → open the URL → Share → **Add to Home Screen**. Opens full-screen like a native app.

## Notes
- Same caveat as the meal app: the Supabase publishable key is in the client (public repo). Fine for a private family tool; anyone with the URL can read/write.
- Service worker is network-first → the app auto-updates on launch when new versions ship.
- "Add features as we go" — likely next: a **summer childcare-coverage view** (the No-Camp gaps already flagged), trip checklists, and a month-grid view.
