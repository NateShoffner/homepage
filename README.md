# homepage

Personal website and blog built with Next.js, deployed on Vercel.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Bootstrap 4 + SCSS
- **Blog:** Markdown files with gray-matter frontmatter
- **Deployment:** Vercel
- **Contact form:** Resend + Cloudflare Turnstile

## Getting Started

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
# fill in .env.local values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See `.env.example` for all required variables.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM` | Sender address for contact form emails |
| `RESEND_TO` | Recipient address for contact form submissions |

For local development, Cloudflare provides test keys that work on any domain:
- Site key: `1x00000000000000000000AA`
- Secret key: `1x0000000000000000000000000000000AA`

## Blog Posts

Posts live in `_posts/` as Markdown files with YAML frontmatter:

```markdown
---
title: Post Title
date: 2025-01-01
description: Short description
categories: [Category]
tags: [tag1, tag2]
image: optional-image.png
---

Post content here.
```

## Admin Panel

A dev-only admin panel is available at `/admin` for managing drafts and published posts. It is blocked in production (`NODE_ENV === 'production'`).
