# nateshoffner.github.io

Personal website and blog. Built with Next.js (App Router), deployed on Vercel.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Bootstrap 4 + SCSS
- **Blog:** Markdown files with gray-matter frontmatter, Disqus comments
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

Posts are served at `/blog/[year]/[month]/[slug]/`. Tags and categories link to filtered listing pages at `/blog/tag/[tag]/` and `/blog/category/[category]/`.

## Resume

The resume lives at `/resume/view` and is protected by Cloudflare Access. The underlying data is stored in `src/_data/resume.yml`, which is encrypted with [SOPS](https://github.com/getsops/sops) using an [age](https://github.com/FiloSottile/age) keypair.

| Variable | Description |
|---|---|
| `AGE_SECRET_KEY` | age private key used to decrypt `resume.yml` at build time |
| `CF_ACCESS_TEAM_DOMAIN` | Cloudflare Access team domain (e.g. `example.cloudflareaccess.com`) |
| `CF_ACCESS_AUD` | Cloudflare Access application audience tag |
| `CF_ACCESS_BYPASS` | Set to `true` to skip JWT validation in local development |

The build script (`scripts/unlock-resume.sh`) downloads the SOPS binary if needed, then decrypts `resume.yml` in-place before `next build` runs. On Vercel, set `AGE_SECRET_KEY` as an environment variable.

To generate a new keypair locally: `age-keygen`. Add the public key to `.sops.yaml` and the private key to `AGE_SECRET_KEY` in `.env.local`.

Routes:
- `/resume/view` — interactive web view
- `/resume/view/print` — print-optimized layout
- `/resume/pdf` — downloads a generated PDF via `@react-pdf/renderer`

## Admin Panel

A dev-only admin panel is available at `/admin` for managing drafts and published posts. Blocked in production (`NODE_ENV === 'production'`).
