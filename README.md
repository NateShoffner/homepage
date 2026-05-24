# nateshoffner.github.io

Personal site built with Next.js and deployed via Vercel.

## Stack

- **Framework**: Next.js 15 (App Router, static export)
- **Language**: TypeScript
- **Styling**: SCSS + Bootstrap 5
- **Markdown**: `react-markdown` + `gray-matter`
- **Lightbox**: Fancybox

## Architecture

### Content

**Blog posts** live as plain Markdown files in `_posts/`. Frontmatter is parsed by `gray-matter`; post images are stored under `public/assets/images/posts/` and referenced by filename only — the `Markdown` component accepts an `imageBasePath` prop that the blog post renderer fills in automatically.

**Projects** are defined in a single YAML file at `src/_data/projects.yml`. Project images live in per-project subdirectories under `public/assets/images/projects/<slug>/`.

Both content types are read from disk at build time via `lib/blog.ts` and `lib/projects.ts` and generate fully static pages.

### Routes

| Path | Description |
|---|---|
| `/` | Single-page home with scroll-spy nav |
| `/blog` | Paginated post listing |
| `/blog/[year]/[month]/[slug]` | Individual post |
| `/blog/category/[category]` | Posts filtered by category |
| `/blog/tag/[tag]` | Posts filtered by tag |
| `/projects` | Project listing |
| `/projects/[slug]` | Individual project |
| `/about`, `/contact` | Static pages |
| `/api/blog/posts` | JSON feed of all posts |
| `/api/projects` | JSON feed of all projects |

### Key files

```
lib/
  blog.ts          # Post parsing and querying
  projects.ts      # Project parsing and querying
src/
  app/             # Next.js App Router pages and API routes
  components/
    Markdown.tsx   # react-markdown wrapper with Fancybox image support
    PostBody.tsx   # Blog post body (sets imageBasePath for posts)
    Navbar.tsx     # Scroll-spy nav with hash routing on home page
  hooks/
    useFancybox.ts
    useScrollSpy.ts
    useProjects.ts
  types/
    BlogPost.ts
    Project.ts
_posts/            # Markdown blog posts
_drafts/           # Draft posts (not built)
public/assets/     # Static images, CSS, and downloadable files
```

### Build

Two environment variables are injected at build time via `next.config.ts`:

- `NEXT_PUBLIC_GIT_REVISION` — short SHA of the current commit
- `NEXT_PUBLIC_BUILD_TIME` — ISO timestamp of the build