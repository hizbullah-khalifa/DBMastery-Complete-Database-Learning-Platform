import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, FileText, SearchX, TerminalSquare } from 'lucide-react'
import { sqlTopics, mongoTopics, sqlCheatCategories, mongoCheatCategories } from '../data/index.js'
import useMeta from '../utils/meta.js'

function buildFullIndex() {
  const items = []
  for (const t of sqlTopics)
    items.push({ kind: 'SQL Lessons', title: t.title, sub: `${t.category} · ${t.diff}`, path: `/sql/${t.slug}`, text: `${t.title} ${t.desc}`.toLowerCase(), snippet: t.desc })
  for (const t of mongoTopics)
    items.push({ kind: 'MongoDB Lessons', title: t.title, sub: `${t.category} · ${t.diff}`, path: `/mongodb/${t.slug}`, text: `${t.title} ${t.desc}`.toLowerCase(), snippet: t.desc })
  for (const cat of sqlCheatCategories)
    for (const c of cat.commands)
      items.push({
        kind: 'SQL Commands',
        title: c.cmd,
        sub: `${cat.name} · ${c.diff}`,
        path: `/sql/cheatsheet#${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
        text: `${c.cmd} ${c.syntax} ${c.desc}`.toLowerCase(),
        snippet: c.desc,
      })
  for (const cat of mongoCheatCategories)
    for (const c of cat.commands)
      items.push({
        kind: 'MongoDB Commands',
        title: c.cmd,
        sub: `${cat.name} · ${c.diff}`,
        path: `/mongodb/cheatsheet#${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
        text: `${c.cmd} ${c.syntax} ${c.desc}`.toLowerCase(),
        snippet: c.desc,
      })
  return items
}

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  useMeta(q ? `Search: ${q}` : 'Search', 'Search across every SQL lesson, MongoDB lesson, cheatsheet command and example on DBMastery.')

  useEffect(() => window.scrollTo(0, 0), [])

  const results = useMemo(() => {
    const index = buildFullIndex()
    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (!terms.length) return []
    return index
      .map((item) => {
        let score = 0
        for (const term of terms) {
          if (item.title.toLowerCase().includes(term)) score += item.title.toLowerCase().startsWith(term) ? 6 : 3
          else if (item.text.includes(term)) score += 1
          else return null
        }
        return { ...item, score }
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
  }, [q])

  const grouped = useMemo(() => {
    const g = {}
    for (const r of results) (g[r.kind] ||= []).push(r)
    return g
  }, [results])

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-12 sm:px-6">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-acc">Search Results</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {q ? <>Results for “<span className="text-gradient">{q}</span>”</> : 'Search the docs'}
      </h1>

      {!q.trim() && (
        <div className="mt-10 rounded-xl border border-dashed border-line p-10 text-center">
          <p className="text-mute">Use the search bar in the navbar or press <kbd className="rounded border border-line bg-card px-1.5 py-0.5 font-mono text-xs">Ctrl K</kbd>.</p>
        </div>
      )}

      {q && results.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-line p-12 text-center" role="status">
          <SearchX size={30} className="mx-auto text-mute/60" />
          <p className="mt-3 font-medium text-ink">Nothing matched “{q}”.</p>
          <p className="mt-1 text-sm text-mute">Try a command like <code className="font-mono text-acc">JOIN</code>, <code className="font-mono text-acc">$group</code> or <code className="font-mono text-acc">index</code>.</p>
        </div>
      )}

      {Object.entries(grouped).map(([kind, rows], gi) => (
        <section key={kind} className="pt-10" aria-label={kind}>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: gi * 0.06 }} className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-mute">
            {kind} · {rows.length}
          </motion.h2>
          <div className="space-y-2">
            {rows.map((r, i) => {
              const Icon = kind.includes('Command') ? TerminalSquare : FileText
              const [path, hash] = r.path.split('#')
              return (
                <motion.div key={r.path + r.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
                  <Link to={path} state={hash ? { hash } : undefined} className="group flex items-center gap-3 rounded-xl border border-line bg-card p-4 transition-all hover:border-acc/40 hover:shadow-md">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-soft text-acc"><Icon size={16} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-sm font-bold text-ink group-hover:text-acc">{r.title}</span>
                      <span className="block truncate text-xs text-mute">{r.snippet}</span>
                      <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wide text-mute/70">{r.sub}</span>
                    </span>
                    <ArrowUpRight size={15} className="shrink-0 text-mute opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
