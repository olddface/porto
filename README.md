# Portfolio (Nuxt + Supabase)

Terminal-themed portfolio with an admin CMS. Content lives in Supabase; images upload directly to Cloudflare R2 via presigned URLs.

[Live site](http://olddface.my.id/)

## Stack

- **Frontend:** Nuxt 4, Vue 3, TypeScript
- **Data:** Supabase (Postgres + Auth)
- **Images:** Cloudflare R2 (S3-compatible API, browser direct upload)
- **Deploy:** Cloudflare Workers (`wrangler`)

## Quick start

### 1. Clone and install

```sh
git clone <repo-url>
cd Portofolio
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in:

```env
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-or-publishable-key
```

### 3. Supabase database

In the [Supabase SQL Editor](https://supabase.com/dashboard), run these in order:

1. `supabase/schema.sql` — base tables and seed data (fresh projects)
2. `supabase/migrations/001_admin_cms.sql` — if upgrading an older DB
3. `supabase/migrations/002_r2_and_project_image.sql` — R2 settings table + `projects.image_url`

Create an admin user in **Authentication → Users** (email + password). Public signups should stay disabled.

### 4. Run locally

```sh
npm run dev
```

- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`

## Image uploads (Cloudflare R2)

Images are **not** stored in Supabase. Files go to R2; only the public URL is saved in Postgres (`projects.image_url` or markdown body).

### R2 bucket setup

1. Create an R2 bucket in Cloudflare.
2. Create an R2 API token with **Object Read & Write** on that bucket.
3. Enable **Public access** on the bucket and copy the public URL (`https://pub-xxxx.r2.dev`) or attach a custom domain.

### Admin storage settings

1. Sign in at `/admin/login`.
2. Open **Settings** (`/admin/settings`).
3. Save:
   - **Cloudflare account ID**
   - **R2 access key ID** and **secret access key**
   - **Bucket name**
   - **Public base URL** — use `https://pub-xxxx.r2.dev` or your custom domain, **not** `accountid.r2.cloudflarestorage.com`

### R2 CORS (required for browser uploads)

Browser uploads PUT directly to R2, so the bucket needs CORS rules for your origins.

**Option A — script:**

```sh
# PowerShell
$env:R2_ACCOUNT_ID="your-account-id"
$env:R2_ACCESS_KEY_ID="your-key"
$env:R2_SECRET_ACCESS_KEY="your-secret"
$env:R2_BUCKET_NAME="your-bucket"
$env:R2_ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000,https://your-domain.com"
npm run configure-r2-cors
```

**Option B — dashboard:** R2 → bucket → **Settings → CORS policy**. Use `r2-cors.json` as a template and set `AllowedOrigins` to your dev and production URLs.

### How upload works

```text
Browser → WebP convert
Browser → POST /api/r2/presign (Nuxt Worker, JWT + RLS)
Worker  → reads your R2 creds from Supabase (owner-only row)
Worker  → returns presigned PUT URL + public URL
Browser → PUT image directly to R2 (empty 200/204 response is normal)
Browser → saves public URL to Supabase project row or markdown
```

Per-user R2 credentials live in `user_r2_settings` with RLS (`auth.uid() = user_id`). Other authenticated users cannot read your credentials.

## Production deploy

```sh
npm run build
npm run deploy
```

Set `NUXT_PUBLIC_SUPABASE_URL` and `NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in your Cloudflare Worker environment (or via wrangler vars).

After deploy, add your production origin to R2 CORS (`R2_ALLOWED_ORIGINS`).

## Admin CMS

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard |
| `/admin/profile` | Name, title, about |
| `/admin/socials` | Social links |
| `/admin/experience` | Work history |
| `/admin/skills` | Skill groups |
| `/admin/projects` | Projects list |
| `/admin/projects/new` | Create project |
| `/admin/projects/:id` | Edit project (image auto-saves on upload) |
| `/admin/settings` | R2 credentials |

Project images: upload on new/edit project forms. Markdown images: use the image button in the editor.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run deploy` | Deploy to Cloudflare Workers |
| `npm run configure-r2-cors` | Apply CORS rules to R2 bucket |
| `npm run download-icons` | Download tech stack icons |

## IDE

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar).
