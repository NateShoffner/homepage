'use client'

import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'

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

type SortOption = 'pushed' | 'stars' | 'name'

interface Props {
  usernames: string[]
  includeForks?: boolean
  includePages?: boolean
  defaultVisibleCount?: number
  defaultSortBy?: SortOption
  showFilters?: boolean
}

function relativeTime(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days < 1) return 'today'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

function sortRepos(repos: Repo[], sort: SortOption): Repo[] {
  return [...repos].sort((a, b) => {
    if (sort === 'stars') return b.stargazers_count - a.stargazers_count
    if (sort === 'name') return a.name.localeCompare(b.name)
    return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
  })
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
  const [visibleCount, setVisibleCount] = useState(defaultVisibleCount)

  useEffect(() => {
    setVisibleCount(defaultVisibleCount)
  }, [defaultVisibleCount])

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

  const resetCount = () => setVisibleCount(defaultVisibleCount)
  const hasActiveFilters = searchQuery !== '' || selectedLang !== '' || selectedOrg !== ''

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedLang('')
    setSelectedOrg('')
    resetCount()
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

  const visible = filtered.slice(0, visibleCount)

  if (loading) {
    return (
      <div className="py-5 text-center text-muted">
        <i className="fa fa-spinner fa-spin fa-2x mb-3 d-block" />
        Loading repositories…
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

  return (
    <div>
      {showFilters && <div className="gw-filter-bar">
        <span className="gw-filter-label">
          <i className="fa fa-filter" /> Filters
        </span>
        <div className="gw-filters">
          <input
            type="search"
            className="form-control gw-search"
            placeholder="Search repos…"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); resetCount() }}
          />

          <select
            className="form-control gw-select"
            value={selectedLang}
            onChange={(e) => { setSelectedLang(e.target.value); resetCount() }}
          >
            <option value="">All Languages</option>
            {languages.map(({ lang, count }) => (
              <option key={lang} value={lang}>{lang} ({count})</option>
            ))}
          </select>

          <select
            className="form-control gw-select"
            value={selectedOrg}
            onChange={(e) => { setSelectedOrg(e.target.value); resetCount() }}
          >
            <option value="">All Accounts</option>
            {orgs.map(({ org, count }) => (
              <option key={org} value={org}>{org} ({count})</option>
            ))}
          </select>

          <select
            className="form-control gw-select"
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as SortOption); resetCount() }}
          >
            <option value="pushed">Recently Updated</option>
            <option value="stars">Most Stars</option>
            <option value="name">Alphabetical</option>
          </select>

          {hasActiveFilters && (
            <button className="btn btn-sm btn-outline-secondary gw-clear" onClick={clearFilters}>
              <i className="fa fa-times" /> Clear
            </button>
          )}
        </div>
      </div>}

      {filtered.length === 0 && (
        <div className="py-5 text-center text-muted">
          <i className="fa fa-search fa-2x mb-3 d-block" />
          No repositories match your filters.
        </div>
      )}

      <div className="gw-grid">
        {visible.map((repo) => (
          <div key={repo.id} className="gw-card">
            <div className="gw-card-header">
              <a href={repo.html_url} className="gw-name" target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
              <div className="gw-stats">
                {repo.stargazers_count > 0 && (
                  <span className="gw-stat">
                    <i className="fa fa-star" /> {repo.stargazers_count}
                  </span>
                )}
                {repo.forks_count > 0 && (
                  <span className="gw-stat">
                    <i className="fa fa-code-fork" /> {repo.forks_count}
                  </span>
                )}
              </div>
            </div>

            <div className="gw-meta">
              {repo.owner.login.toLowerCase() !== 'nateshoffner' && (
                <>
                  <span className="gw-org"><i className="fa fa-users" /> {repo.owner.login}</span>
                  <span className="gw-meta-sep">·</span>
                </>
              )}
              {repo.language
                ? <span className="gw-lang">{repo.language}</span>
                : <span className="gw-lang gw-placeholder">Unknown</span>
              }
              <span className="gw-meta-sep">·</span>
              <span className="gw-updated">{relativeTime(repo.pushed_at)}</span>
              {repo.fork && (
                <>
                  <span className="gw-meta-sep">·</span>
                  <span className="gw-fork"><i className="fa fa-code-fork" /> Fork</span>
                </>
              )}
              {repo.homepage && (
                <>
                  <span className="gw-meta-sep">·</span>
                  <a href={repo.homepage} className="gw-homepage" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-external-link" />
                  </a>
                </>
              )}
            </div>

            <div className="gw-desc">
              {repo.description
                ? repo.description
                : <span className="gw-placeholder">No description provided.</span>
              }
            </div>

            {repo.topics?.length > 0 && (
              <div className="gw-topics">
                {repo.topics.map((t) => (
                  <span key={t} className="badge">{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {visibleCount < filtered.length && (
        <div className="gw-load-more">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setVisibleCount((n) => n + 12)}
          >
            Load more ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  )
}

export default GitHubRepoViewer
