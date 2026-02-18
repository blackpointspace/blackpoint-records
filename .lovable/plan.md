

# Black Point Space - Lovable Cloud Integration Plan

## Overview
This plan enables Lovable Cloud (Supabase) for the project and adds real authentication, database, file storage, payments, and an improved admin dashboard -- replacing all current mock data with real backend functionality.

---

## Phase 1: Enable Lovable Cloud and Database Setup

### 1.1 Enable Lovable Cloud
- Activate Lovable Cloud to get Supabase database, auth, storage, and edge functions.

### 1.2 Database Schema (Migrations)

**Tables to create:**

- **profiles** -- `id (FK auth.users)`, `name`, `avatar_url`, `biography`, `social_links (JSONB)`, `created_at`
- **user_roles** -- `id`, `user_id (FK auth.users)`, `role (enum: admin, artist)` -- roles stored separately for security
- **releases** -- `id`, `user_id`, `title`, `type (single/album)`, `cover_art_url`, `release_date`, `status (draft/pending/approved/rejected/published)`, `created_at`
- **tracks** -- `id`, `release_id`, `title`, `isrc`, `duration`, `audio_file_url`, `track_number`
- **streams** -- `id`, `track_id`, `platform`, `streams`, `downloads`, `date`
- **royalties** -- `id`, `user_id`, `month`, `amount`, `status (pending/available/paid)`
- **documents** -- `id`, `user_id`, `title`, `file_url`, `created_at`
- **notifications** -- `id`, `user_id (nullable for broadcast)`, `title`, `message`, `is_read`, `created_at`

**Security:**
- RLS on all tables
- `has_role()` security definer function for admin checks
- Artists can only see their own data; admins can see all

### 1.3 Storage Buckets
- **covers** (public) -- cover art images
- **audio** (private) -- music files (MP3/WAV), accessed via signed URLs
- **documents** (private) -- admin-uploaded docs for artists

### 1.4 Seed Data
- 1 admin user (`admin@blackpoint.space`)
- 2 sample artists with releases, tracks, streams, and royalties

---

## Phase 2: Authentication

### 2.1 Real Login/Signup
- Replace mock login with Supabase Auth (email/password)
- Auto-create profile on signup via database trigger
- New artists get `artist` role by default
- Redirect based on role (admin to `/admin`, artist to `/dashboard`)

### 2.2 Protected Routes
- Auth context/provider wrapping the app
- Redirect unauthenticated users to `/login`
- Role-based route protection (admin routes only for admins)

---

## Phase 3: File Uploads

### 3.1 Cover Art Upload (NewRelease page)
- Real file picker with image preview
- Upload to `covers` bucket on submit
- Store public URL in `releases.cover_art_url`

### 3.2 Audio File Upload (NewRelease page)
- Upload MP3/WAV files per track to `audio` bucket
- Show upload progress bar
- Store signed URL reference in `tracks.audio_file_url`
- Validate file format (MP3/WAV only)

### 3.3 Admin Document Upload
- Admin can upload files to `documents` bucket for specific artists
- Artists access via signed URLs on the Documents page

---

## Phase 4: Improved Admin Dashboard

### 4.1 Enhanced Stats Cards
- Real-time counts from database (total artists, releases, streams, royalties paid)
- Percentage change indicators

### 4.2 Charts
- **Streams over time** -- area chart showing platform-wide streams (last 30 days)
- **Revenue chart** -- bar chart of royalties by month
- **Streams by platform** -- pie/donut chart

### 4.3 Artists Management
- Searchable/filterable artist list with real data
- View artist detail (releases, streams, earnings)
- Create new artist (generates account, sends welcome email)

### 4.4 New Admin Pages
- **Admin Artist Detail** -- view an artist's releases, streams, and royalties
- **Admin Send Notification** -- form to send notification to one or all artists
- **Admin Upload Document** -- select artist + upload file

### 4.5 Release Approval Workflow
- Admin sees pending releases with full details
- Approve/reject with status update in database
- Artist gets notification on status change

---

## Phase 5: Stripe Payments

### 5.1 Enable Stripe Integration
- Connect Stripe via Lovable's built-in integration

### 5.2 Products and Prices
- Create Stripe products for each plan (Starter, Rockstar, AMPLIFY, AMPLIFY+, AMPLIFY Pro)
- Subscription billing for annual plans
- One-time payment for per-release plans

### 5.3 Checkout Flow
- Pricing page buttons trigger Stripe Checkout
- After payment, update user's plan status in database
- Gate release creation behind active plan

---

## Phase 6: Connect Everything

### 6.1 Replace All Mock Data
- Dashboard pulls real streams/royalties from database
- Releases page shows user's actual releases
- Notifications loaded from database with real-time unread count
- Royalties page shows real payment history

### 6.2 CSV Import (Admin)
- Real CSV file parsing on the AdminImport page
- Parse and insert stream records into the `streams` table
- Validation and error reporting

---

## Technical Details

### File Structure (new/modified files)
```text
src/
  integrations/supabase/     -- auto-generated client + types
  contexts/AuthContext.tsx    -- auth state management
  hooks/useAuth.ts           -- auth hook
  hooks/useReleases.ts       -- releases CRUD
  hooks/useRoyalties.ts      -- royalties queries
  hooks/useNotifications.ts  -- notifications queries
  hooks/useAdminStats.ts     -- admin dashboard stats
  components/
    ProtectedRoute.tsx        -- route guard
    FileUpload.tsx            -- reusable upload component
    AudioUploader.tsx         -- audio file uploader with progress
  pages/
    Login.tsx                 -- updated with Supabase auth
    NewRelease.tsx            -- updated with real uploads
    Dashboard.tsx             -- updated with real data
    AdminDashboard.tsx        -- enhanced with charts + real data
    AdminArtistDetail.tsx     -- new page
    AdminSendNotification.tsx -- new page
    AdminUploadDocument.tsx   -- new page
```

### Migration order
1. Enum types and helper functions
2. Base tables (profiles, user_roles, releases, tracks, streams, royalties, documents, notifications)
3. RLS policies
4. Storage buckets + policies
5. Triggers (auto-create profile on signup)
6. Seed data

