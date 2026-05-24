'use client'

import { useState, useMemo } from 'react'
import Script from 'next/script'
import type { PostMeta } from '@/lib/blog'
import { BlogPostCard } from './BlogPostCard'

interface Props {
  posts: PostMeta[]
  categories: string[]
  tags: string[]
}

export default function BlogListInteractive({ posts, categories, tags }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [activeTag, setActiveTag] = useState('')
  const [activeYear, setActiveYear] = useState('')

  const years = useMemo(() => {
    const ys = [...new Set(
      posts
        .map((p) => p.date ? new Date(p.date).getUTCFullYear().toString() : null)
        .filter(Boolean) as string[]
    )]
    return ys.sort((a, b) => Number(b) - Number(a))
  }, [posts])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return posts.filter((p) => {
      if (activeCategory && !p.categories.includes(activeCategory)) return false
      if (activeTag && !p.tags.includes(activeTag)) return false
      if (activeYear && (!p.date || new Date(p.date).getUTCFullYear().toString() !== activeYear)) return false
      if (q && !p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false
      return true
    })
  }, [posts, search, activeCategory, activeTag, activeYear])

  const hasFilters = search.trim() !== '' || activeCategory !== '' || activeTag !== '' || activeYear !== ''

  function clearAll() {
    setSearch('')
    setActiveCategory('')
    setActiveTag('')
    setActiveYear('')
  }

  const grouped = useMemo(() => {
    const acc: Record<string, PostMeta[]> = {}
    for (const post of filtered) {
      const year = post.date ? new Date(post.date).getUTCFullYear().toString() : 'Undated'
      ;(acc[year] ??= []).push(post)
    }
    return Object.entries(acc).sort(([a], [b]) =>
      b === 'Undated' ? -1 : a === 'Undated' ? 1 : Number(b) - Number(a)
    )
  }, [filtered])

  return (
    <>
      <div className="row mb-4" style={{ gap: '0.5rem 0' }}>
        <div className="col-12 col-md-4">
          <input
            type="search"
            className="form-control"
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-6 col-md-2">
          <select className="form-control" value={activeYear} onChange={(e) => setActiveYear(e.target.value)}>
            <option value="">All years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {categories.length > 0 && (
          <div className="col-6 col-md-3">
            <select className="form-control" value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {tags.length > 0 && (
          <div className="col-6 col-md-3">
            <select className="form-control" value={activeTag} onChange={(e) => setActiveTag(e.target.value)}>
              <option value="">All tags</option>
              {tags.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}
      </div>

      {hasFilters && (
        <p className="text-muted small mb-3">
          {filtered.length} post{filtered.length !== 1 ? 's' : ''} found
          {' · '}
          <button className="btn btn-link btn-sm p-0" style={{ verticalAlign: 'baseline' }} onClick={clearAll}>
            clear filters
          </button>
        </p>
      )}

      {grouped.length === 0 ? (
        <p className="text-muted">No posts match your filters.</p>
      ) : (
        grouped.map(([year, yearPosts]) => (
          <div key={year} className="mb-4">
            <h4 className="mb-2 text-muted">{year}</h4>
            <div className="list-cards">
              {yearPosts.map((post) => (
                <BlogPostCard
                  key={post.slug}
                  post={post}
                  onCategoryClick={(cat) => setActiveCategory((prev) => prev === cat ? '' : cat)}
                  showImage={false}
                />
              ))}
            </div>
          </div>
        ))
      )}

      <Script id="dsq-count-scr" src="//nateshoffner.disqus.com/count.js" strategy="afterInteractive" />
    </>
  )
}
