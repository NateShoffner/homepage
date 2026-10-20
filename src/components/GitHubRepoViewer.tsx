'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import axios from 'axios'
import { LanguageIcon } from '@components/LanguageIcon'

function SkeletonGitHubCard() {
  return (
    <div className="gw-card skeleton-card" aria-hidden="true">
      <div className="gw-card-body">
        <div className="skeleton-line" style={{ width: '55%', height: '0.9rem' }} />
        <div className="skeleton-line" style={{ width: '90%', height: '0.78rem' }} />
        <div className="skeleton-line" style={{ width: '70%', height: '0.78rem' }} />
        <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.25rem' }}>
          <div className="skeleton-line" style={{ width: '3.5rem', height: '0.7rem', borderRadius: '999px' }} />
          <div className="skeleton-line" style={{ width: '4.5rem', height: '0.7rem', borderRadius: '999px' }} />
        </div>
        <div className="skeleton-line" style={{ width: '65%', height: '0.72rem', marginTop: '0.1rem' }} />
      </div>
    </div>
  )
}

interface Repo {
  id: number
  name: string
  html_url: string
  description: string | null
  language: string | null
  fork: boolean
  homepage: string
  pushed_at: string
  stargazers_count: number
  forks_count: number
  topics: string[]
  owner: { login: string }
}

type SortOption = 'stars' | 'pushed' | 'name'
type ViewMode = 'cards' | 'table'

interface Props {
  usernames: string[]
  includeForks?: boolean
  includePages?: boolean
  defaultVisibleCount?: number
  defaultSortBy?: SortOption
  showFilters?: boolean
}

const PAGE_SIZE_OPTIONS = [12, 24, 48, 0] as const
const MAX_VISIBLE_TOPICS = 4

function relativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const days = Math.floor((Date.now() - date.getTime()) / 86400000)
  if (days < 1) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  if (weeks === 1) return '1 week ago'
  if (days < 60) return `${weeks} weeks ago`
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(!sameYear && { year: 'numeric' }) })
}

function sortRepos(repos: Repo[], sort: SortOption): Repo[] {
  return [...repos].sort((a, b) => {
    if (sort === 'stars') {
      const diff = b.stargazers_count - a.stargazers_count
      return diff !== 0 ? diff : new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
    }
    if (sort === 'name') return a.name.localeCompare(b.name)
    return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
  })
}

function Sparkline({ data, id, flatline = false }: { data: number[]; id: number; flatline?: boolean }) {
  const W = 100, H = 40, pad = 1.5
  const midY = (H / 2).toFixed(2)

  if (flatline) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="gw-sparkline gw-sparkline--flat" preserveAspectRatio="none" aria-hidden="true">
        <line x1={pad} y1={midY} x2={W - pad} y2={midY} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    )
  }

  const weeks = data
  const max = Math.max(...weeks, 1)
  if (weeks.every((v) => v === 0)) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="gw-sparkline gw-sparkline--flat" preserveAspectRatio="none" aria-hidden="true">
        <line x1={pad} y1={midY} x2={W - pad} y2={midY} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    )
  }

  const pts = weeks.map((v, i) => [
    pad + (i / (weeks.length - 1)) * (W - pad * 2),
    pad + (1 - v / max) * (H - pad * 2),
  ])

  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1][0].toFixed(2)},${H} L${pts[0][0].toFixed(2)},${H} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="gw-sparkline" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${id})`} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

interface MenuOption {
  value: string
  label: string
  short?: string
  count?: number
}

function FilterMenu({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string
  value: string
  placeholder?: string
  options: MenuOption[]
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const current = options.find((o) => o.value === value)
  const display = value === '' ? (placeholder ?? 'All') : (current?.short ?? current?.label ?? value)
  const isFiltering = placeholder !== undefined && value !== ''

  return (
    <div className={`gw-menu${open ? ' gw-menu--open' : ''}`} ref={ref}>
      <button
        type="button"
        className={`gw-menu-btn${isFiltering ? ' gw-menu-btn--active' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="gw-menu-btn-label">{label}</span>
        <span className="gw-menu-btn-value">{display}</span>
        <i className="fa fa-angle-down gw-menu-caret" aria-hidden="true" />
      </button>

      {open && (
        <ul className="gw-menu-list" role="listbox" aria-label={label}>
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={`gw-menu-item${option.value === value ? ' gw-menu-item--selected' : ''}`}
                onClick={() => { onChange(option.value); setOpen(false) }}
              >
                <span>{option.label}</span>
                {option.count !== undefined && <span className="gw-menu-item-count">{option.count}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ViewToggle({ viewMode, onChange }: { viewMode: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <div className="gw-view-toggle">
      <button
        type="button"
        className={`gw-view-btn${viewMode === 'cards' ? ' active' : ''}`}
        onClick={() => onChange('cards')}
        title="Card view"
        aria-label="Card view"
        aria-pressed={viewMode === 'cards'}
      >
        <i className="fa fa-th-large" />
      </button>
      <button
        type="button"
        className={`gw-view-btn${viewMode === 'table' ? ' active' : ''}`}
        onClick={() => onChange('table')}
        title="Table view"
        aria-label="Table view"
        aria-pressed={viewMode === 'table'}
      >
        <i className="fa fa-list" />
      </button>
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  onChange,
  mobileOnly = false,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
  mobileOnly?: boolean
}) {
  if (totalPages <= 1) return null
  return (
    <div className={`gw-pagination${mobileOnly ? ' gw-pagination--mobile-only' : ''}`}>
      <button
        type="button"
        className="gw-page-btn"
        onClick={() => onChange(1)}
        disabled={page === 1}
        aria-label="First page"
      >
        <i className="fa fa-step-backward" />
      </button>
      <button
        type="button"
        className="gw-page-btn"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <i className="fa fa-chevron-left" />
      </button>
      <span className="gw-page-info">
        <span className="gw-page-current">{page}</span> / {totalPages}
      </span>
      <button
        type="button"
        className="gw-page-btn"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <i className="fa fa-chevron-right" />
      </button>
      <button
        type="button"
        className="gw-page-btn"
        onClick={() => onChange(totalPages)}
        disabled={page === totalPages}
        aria-label="Last page"
      >
        <i className="fa fa-step-forward" />
      </button>
    </div>
  )
}

const GitHubRepoViewer: React.FC<Props> = ({
  usernames,
  includeForks = true,
  includePages = true,
  defaultVisibleCount = 12,
  defaultSortBy = 'pushed',
  showFilters = true,
}) => {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLang, setSelectedLang] = useState('')
  const [selectedOrg, setSelectedOrg] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>(defaultSortBy)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(defaultVisibleCount)
  const [activityMap, setActivityMap] = useState<Record<number, number[]>>({})
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const fetchingIds = useRef(new Set<number>())

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true)
      setLoadError(false)
      try {
        const response = await axios.get<Repo[]>(
          `/api/github/repos?usernames=${usernames.join(',')}`
        )
        const filtered = response.data.filter((repo) => {
          if (!includeForks && repo.fork) return false
          if (!includePages && repo.name.endsWith('.github.io')) return false
          return true
        })
        setRepos(filtered)
      } catch (err) {
        console.error('Failed to fetch repos', err)
        setLoadError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [usernames, includeForks, includePages])

  const languages = useMemo(() => {
    const counts = new Map<string, number>()
    for (const repo of repos) {
      const lang = repo.language ?? 'Other'
      counts.set(lang, (counts.get(lang) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([lang, count]) => ({ lang, count }))
  }, [repos])

  const orgs = useMemo(() => {
    const counts = new Map<string, number>()
    for (const repo of repos) {
      const login = repo.owner.login
      counts.set(login, (counts.get(login) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([org, count]) => ({ org, count }))
  }, [repos])

  const resetPage = () => setCurrentPage(1)
  const hasActiveFilters = searchQuery !== '' || selectedLang !== '' || selectedOrg !== ''

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedLang('')
    setSelectedOrg('')
    resetPage()
  }

  const filtered = useMemo(() => {
    let result = repos
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) => r.name.toLowerCase().includes(q) || (r.description ?? '').toLowerCase().includes(q)
      )
    }
    if (selectedLang) result = result.filter((r) => (r.language ?? 'Other') === selectedLang)
    if (selectedOrg) result = result.filter((r) => r.owner.login === selectedOrg)
    return sortRepos(result, sortBy)
  }, [repos, searchQuery, selectedLang, selectedOrg, sortBy])

  const totalPages = pageSize === 0 ? 1 : Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(Math.max(1, currentPage), totalPages)
  const visible = pageSize === 0 ? filtered : filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
  // Pad short pages so every page is the same height and the pager never moves.
  const fillerCount = pageSize > 0 && totalPages > 1 ? pageSize - visible.length : 0
  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * (pageSize || filtered.length) + 1
  const rangeEnd = pageSize === 0 ? filtered.length : Math.min(filtered.length, safePage * pageSize)

  const visibleKey = visible.map((r) => r.id).join(',')

  useEffect(() => {
    const unfetched = visible.filter((r) => !fetchingIds.current.has(r.id))
    if (unfetched.length === 0) return

    for (const repo of unfetched) fetchingIds.current.add(repo.id)

    const repoPaths = unfetched.map((r) => `${r.owner.login}/${r.name}`).join(',')
    fetch(`/api/github/activity/batch?repos=${repoPaths}`)
      .then((r) => r.json())
      .then((data: Record<string, number[]>) => {
        const updates: Record<number, number[]> = {}
        for (const repo of unfetched) {
          const weeks = data[`${repo.owner.login}/${repo.name}`]
          if (weeks && weeks.length > 0) updates[repo.id] = weeks
        }
        if (Object.keys(updates).length > 0) {
          setActivityMap((prev) => ({ ...prev, ...updates }))
        }
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleKey])

  if (loading) {
    return (
      <div className="gw-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonGitHubCard key={i} />
        ))}
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="py-5 text-center text-muted">
        <i className="fa fa-exclamation-circle fa-2x mb-3 d-block" />
        Couldn&apos;t load repositories. Please try again later.
      </div>
    )
  }

  const languageOptions: MenuOption[] = [
    { value: '', label: 'All languages' },
    ...languages.map(({ lang, count }) => ({ value: lang, label: lang, count })),
  ]

  const orgOptions: MenuOption[] = [
    { value: '', label: 'All accounts' },
    ...orgs.map(({ org, count }) => ({ value: org, label: org, count })),
  ]

  const sortOptions: MenuOption[] = [
    { value: 'pushed', label: 'Recently updated', short: 'Updated' },
    { value: 'stars', label: 'Most stars', short: 'Stars' },
    { value: 'name', label: 'Name (A–Z)', short: 'Name' },
  ]

  return (
    <div className="gw">
      {showFilters && (
        <>
          <div className="gw-toolbar">
            <div className="gw-search">
              <i className="fa fa-search gw-search-icon" aria-hidden="true" />
              <input
                type="search"
                className="gw-search-input"
                placeholder="Search repositories"
                aria-label="Search repositories"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); resetPage() }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="gw-search-clear"
                  onClick={() => { setSearchQuery(''); resetPage() }}
                  aria-label="Clear search"
                >
                  <i className="fa fa-times" />
                </button>
              )}
            </div>

            <div className="gw-toolbar-controls">
              <FilterMenu
                label="Language"
                value={selectedLang}
                placeholder="All"
                options={languageOptions}
                onChange={(value) => { setSelectedLang(value); resetPage() }}
              />

              {orgs.length > 1 && (
                <FilterMenu
                  label="Account"
                  value={selectedOrg}
                  placeholder="All"
                  options={orgOptions}
                  onChange={(value) => { setSelectedOrg(value); resetPage() }}
                />
              )}

              <FilterMenu
                label="Sort"
                value={sortBy}
                options={sortOptions}
                onChange={(value) => { setSortBy(value as SortOption); resetPage() }}
              />

              <ViewToggle viewMode={viewMode} onChange={setViewMode} />
            </div>
          </div>

          <div className="gw-status">
            <span className="gw-count">
              {filtered.length} {filtered.length === 1 ? 'repository' : 'repositories'}
            </span>

            {searchQuery && (
              <button type="button" className="gw-chip" onClick={() => { setSearchQuery(''); resetPage() }}>
                <span className="gw-chip-label">{searchQuery}</span>
                <i className="fa fa-times" aria-hidden="true" />
                <span className="sr-only">Clear search filter</span>
              </button>
            )}

            {selectedLang && (
              <button type="button" className="gw-chip" onClick={() => { setSelectedLang(''); resetPage() }}>
                <span className="gw-chip-label">{selectedLang}</span>
                <i className="fa fa-times" aria-hidden="true" />
                <span className="sr-only">Clear language filter</span>
              </button>
            )}

            {selectedOrg && (
              <button type="button" className="gw-chip" onClick={() => { setSelectedOrg(''); resetPage() }}>
                <span className="gw-chip-label">{selectedOrg}</span>
                <i className="fa fa-times" aria-hidden="true" />
                <span className="sr-only">Clear account filter</span>
              </button>
            )}

            {hasActiveFilters && (
              <button type="button" className="gw-chip-clear" onClick={clearFilters}>
                Clear all
              </button>
            )}
          </div>
        </>
      )}

      {filtered.length === 0 && (
        <div className="py-5 text-center text-muted">
          <i className="fa fa-search fa-2x mb-3 d-block" />
          No repositories match your filters.
        </div>
      )}

      <Pagination page={safePage} totalPages={totalPages} onChange={setCurrentPage} mobileOnly />

      {filtered.length > 0 && viewMode === 'cards' && (
        <div className="gw-grid">
          {visible.map((repo) => (
            <div key={repo.id} className="gw-card">
              <div className="gw-card-body">
                <a href={repo.html_url} className="gw-name" title={repo.name} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>

                <div className="gw-desc">
                  {repo.description
                    ? repo.description
                    : <span className="gw-placeholder">No description provided.</span>
                  }
                </div>

                <div className="gw-topics">
                  {repo.topics?.slice(0, MAX_VISIBLE_TOPICS).map((t) => (
                    <span key={t} className="badge">{t}</span>
                  ))}
                  {repo.topics?.length > MAX_VISIBLE_TOPICS && (
                    <span className="badge gw-topics-more" title={repo.topics.slice(MAX_VISIBLE_TOPICS).join(', ')}>
                      +{repo.topics.length - MAX_VISIBLE_TOPICS}
                    </span>
                  )}
                </div>

                <div className="gw-meta">
                  {repo.language
                    ? <span className="gw-lang"><LanguageIcon language={repo.language} /> {repo.language}</span>
                    : <span className="gw-lang gw-placeholder"><i className="fa fa-question-circle" /> Unknown</span>
                  }
                  {repo.stargazers_count > 0 && (
                    <>
                      <span className="gw-meta-sep">·</span>
                      <span className="gw-stat"><i className="fa fa-star" /> {repo.stargazers_count}</span>
                    </>
                  )}
                  {repo.forks_count > 0 && (
                    <>
                      <span className="gw-meta-sep">·</span>
                      <span className="gw-stat"><i className="fa fa-code-fork" /> {repo.forks_count}</span>
                    </>
                  )}
                  <span className="gw-meta-sep">·</span>
                  <span className="gw-updated" title={new Date(repo.pushed_at).toLocaleString()}>
                    Updated {relativeTime(repo.pushed_at)}
                  </span>
                  {repo.fork && (
                    <>
                      <span className="gw-meta-sep">·</span>
                      <span className="gw-fork"><i className="fa fa-code-fork" /> Fork</span>
                    </>
                  )}
                  {repo.homepage && (() => {
                    let host = repo.homepage
                    try { host = new URL(repo.homepage).hostname.replace(/^www\./, '') } catch {}
                    return (
                      <>
                        <span className="gw-meta-sep">·</span>
                        <a href={repo.homepage} className="gw-homepage-link" target="_blank" rel="noopener noreferrer">
                          <i className="fa fa-external-link" /> {host}
                        </a>
                      </>
                    )
                  })()}
                  {repo.owner.login.toLowerCase() !== 'nateshoffner' && (
                    <>
                      <span className="gw-meta-sep">·</span>
                      <span className="gw-org"><i className="fa fa-users" /> {repo.owner.login}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="gw-sparkline-wrap">
                {activityMap[repo.id]
                  ? <Sparkline data={activityMap[repo.id]} id={repo.id} />
                  : <Sparkline data={[]} id={repo.id} flatline />
                }
              </div>
            </div>
          ))}

          {Array.from({ length: fillerCount }).map((_, i) => (
            <div key={`filler-${i}`} className="gw-card gw-card--filler" aria-hidden="true" />
          ))}
        </div>
      )}

      {filtered.length > 0 && viewMode === 'table' && (
        <table className="gw-table">
          <thead>
            <tr>
              <th>Repository</th>
              <th className="d-none d-sm-table-cell">Language</th>
              <th className="d-none d-md-table-cell">Stars</th>
              <th className="d-none d-md-table-cell">Forks</th>
              <th className="d-none d-sm-table-cell">Updated</th>
              <th className="d-none d-lg-table-cell">Activity</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((repo) => (
              <tr key={repo.id}>
                <td>
                  <a href={repo.html_url} className="gw-name" target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                  {repo.owner.login.toLowerCase() !== 'nateshoffner' && (
                    <span className="gw-table-org">{repo.owner.login}</span>
                  )}
                  <span className="gw-table-desc">{repo.description}</span>
                </td>
                <td className="gw-table-lang d-none d-sm-table-cell">
                  {repo.language
                    ? <><LanguageIcon language={repo.language} /> {repo.language}</>
                    : <span className="gw-placeholder"><i className="fa fa-question-circle" /> Unknown</span>
                  }
                </td>
                <td className="gw-table-stars d-none d-md-table-cell">
                  {repo.stargazers_count > 0
                    ? <><i className="fa fa-star" /> {repo.stargazers_count}</>
                    : <span className="gw-placeholder">&ndash;</span>
                  }
                </td>
                <td className="gw-table-forks d-none d-md-table-cell">
                  {repo.forks_count > 0
                    ? <><i className="fa fa-code-fork" /> {repo.forks_count}</>
                    : <span className="gw-placeholder">&ndash;</span>
                  }
                </td>
                <td className="gw-table-date d-none d-sm-table-cell">
                  {relativeTime(repo.pushed_at)}
                </td>
                <td className="gw-table-activity d-none d-lg-table-cell">
                  {activityMap[repo.id]
                    ? <Sparkline data={activityMap[repo.id]} id={repo.id} />
                    : <Sparkline data={[]} id={repo.id} flatline />
                  }
                </td>
              </tr>
            ))}

            {Array.from({ length: fillerCount }).map((_, i) => (
              <tr key={`filler-${i}`} className="gw-table-filler" aria-hidden="true">
                <td colSpan={6} />
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {filtered.length > 0 && (
        <div className="gw-pager">
          <span className="gw-pager-info">
            {pageSize === 0
              ? `Showing all ${filtered.length}`
              : `Showing ${rangeStart}–${rangeEnd} of ${filtered.length}`}
          </span>

          <Pagination page={safePage} totalPages={totalPages} onChange={setCurrentPage} />

          <div className="gw-pager-size">
            <span className="gw-pager-size-label">Show</span>
            {PAGE_SIZE_OPTIONS.map((n) => (
              <button
                type="button"
                key={n}
                className={`gw-size-btn${pageSize === n ? ' active' : ''}`}
                onClick={() => { setPageSize(n); resetPage() }}
                aria-pressed={pageSize === n}
              >
                {n === 0 ? 'All' : n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GitHubRepoViewer
