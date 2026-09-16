# Mobile Journal Specification

## 1. Product Intent

Mobile-first private electronic journal for recording a day with text, photos, mood,
weather, location, and tags. The experience should feel like a retro scrapbook:
paper texture, collage layers, tape, stamps, and warm colors without sacrificing
readability or speed.

## 2. Target User and Core Job

- User: one person recording personal daily memories on a phone.
- Core job: open the app, choose a date, write a journal entry, attach photos,
  and return later to browse memories.

## 3. MVP Scope

### Authentication

- Email one-time code login through Supabase Auth.
- Every journal entry and uploaded image is private to its owner by default.
- Unauthenticated users see a welcome screen and cannot access journal data.

### Journal entries

- Create, view, edit, and delete an entry for any date.
- Fields: date, title, body, mood, weather, location, and tags.
- One entry per date in the MVP; editing the date must prevent duplicates.
- Empty title/body is allowed while drafting, but saving requires a date and body.

### Images

- Select multiple images from the phone photo picker.
- Show previews before saving; remove images and drag to reorder.
- Compress oversized images in the browser before upload.
- Store files in a private Supabase Storage bucket and metadata in the database.
- Deleting an entry removes its image references; physical file cleanup must be
  handled safely and must not expose public URLs.

### Browsing and search

- Home opens on today's date and clearly shows whether a record exists.
- Timeline view sorted newest first.
- Month calendar marks dates with entries and opens an entry by tapping a date.
- Search title, body, location, and tags.
- Filter by mood and weather is optional after the core search works.

### Responsive/PWA

- Phone-first layout, usable at 320px width and up.
- Add-to-home-screen metadata and installable web app shell.
- Accessible labels, keyboard support, visible focus, and touch targets of at least
  44px.

## 4. Explicitly Out of Scope for MVP

- Public sharing, followers, comments, or social features.
- Native iOS/Android applications.
- AI writing assistance, templates, sticker marketplace, and collaborative journals.
- PIN/biometric app lock; account privacy is the first protection layer.
- Offline conflict resolution. A later release may add offline drafts.

## 5. Proposed Technical Architecture

- Frontend: React + TypeScript + Vite, mobile-first CSS, PWA manifest.
- Backend: Supabase Auth, Postgres, Row Level Security, and private Storage.
- Deployment: Vercel connected to the GitHub repository.
- Repository: `junelovecat/mobile-journal`.

## 6. Data Model

### `journal_entries`

- `id` uuid primary key
- `user_id` uuid references `auth.users`
- `entry_date` date
- `title` text
- `body` text
- `mood` text nullable
- `weather` text nullable
- `location` text nullable
- `tags` text[] default `{}`
- `created_at`, `updated_at` timestamptz
- Unique constraint on (`user_id`, `entry_date`)

### `journal_images`

- `id` uuid primary key
- `entry_id` uuid references `journal_entries` on delete cascade
- `user_id` uuid references `auth.users`
- `storage_path` text
- `original_name` text
- `sort_order` integer
- `created_at` timestamptz

RLS policies must restrict both tables to the authenticated owner. Storage access
must use private paths scoped by user ID and signed URLs.

## 7. Acceptance Criteria

- A new user can request an email code, authenticate, and reach today's journal.
- A user can save a complete entry with all fields and zero or more images.
- A user can upload at least five images, preview them, remove one, reorder them,
  and see the final order after reopening the entry.
- A user can edit and delete only their own entries.
- Timeline, month calendar, and search return only the user's own entries.
- Refreshing the page preserves saved entries and image previews load securely.
- The main flows work on a narrow mobile viewport without horizontal scrolling.
- Vercel production build succeeds with Supabase variables configured.

## 8. Delivery Plan

1. Build and validate the frontend with local mock data.
2. Add Supabase schema, RLS, Auth, Storage, and signed-image access.
3. Add responsive/PWA polish and automated checks.
4. Push to GitHub and connect the repository to Vercel.
5. Configure Supabase redirect URLs and production environment variables.

## 9. Open Decisions

- Product name and logo wording.
- Exact mood/weather option lists.
- Whether one date may contain multiple entries in a later version.
- Supabase and Vercel accounts must be created by the owner; credentials must not
  be committed to GitHub.
