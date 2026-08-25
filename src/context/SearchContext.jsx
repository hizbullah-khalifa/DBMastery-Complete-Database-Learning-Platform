import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/** One flat search index built from every lesson + cheatsheet command. */
function buildIndex(sqlTopics, mongoTopics, sqlCats, mongoCats) {
  const items = []
  for (const t of sqlTopics)
    items.push({
      kind: 'SQL Lesson',
      title: t.title,
      sub: `SQL · ${t.category}`,
      path: `/sql/${t.slug}`,
      haystack: `${t.title} ${t.desc} ${t.category} sql`.toLowerCase(),
    })
  for (const t of mongoTopics)
    items.push({
      kind: 'MongoDB Lesson',
      title: t.title,
      sub: `MongoDB · ${t.category}`,
      path: `/mongodb/${t.slug}`,
      haystack: `${t.title} ${t.desc} ${t.category} mongodb mongo nosql`.toLowerCase(),
    })
  for (const cat of sqlCats)
    for (const c of cat.commands)
      items.push({
        kind: 'SQL Command',
        title: c.cmd,
        sub: `SQL Cheatsheet · ${cat.name}`,
        path: `/sql/cheatsheet#${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
        haystack: `${c.cmd} ${c.syntax} ${c.desc} ${c.example}`.toLowerCase(),
        snippet: c.desc,
      })
  for (const cat of mongoCats)
    for (const c of cat.commands)
      items.push({
        kind: 'MongoDB Command',
        title: c.cmd,
        sub: `MongoDB Cheatsheet · ${cat.name}`,
        path: `/mongodb/cheatsheet#${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
        haystack: `${c.cmd} ${c.syntax} ${c.desc} ${c.example}`.toLowerCase(),
        snippet: c.desc,
      })
  return items
}

const SearchContext = createContext(null)

export function SearchProvider({ children, index }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const terms = q.split(/\s+/)
    return buildIndex(...index)
      .map((item) => {
        let score = 0
        for (const term of terms) {
          if (item.title.toLowerCase().includes(term)) score += item.title.toLowerCase().startsWith(term) ? 6 : 3
          else if (item.haystack.includes(term)) score += 1
          else return null
        }
        return { ...item, score }
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
  }, [query, index])

  const go = useCallback(
    (path) => {
      setOpen(false)
      setQuery('')
      navigate(path)
    },
    [navigate]
  )

  return (
    <SearchContext.Provider value={{ open, setOpen, query, setQuery, results, go }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  return useContext(SearchContext)
}
