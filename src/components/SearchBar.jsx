import { useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, CornerDownLeft, FileText, Search, TerminalSquare } from 'lucide-react'
import { useSearch } from '../context/SearchContext.jsx'

function kindIcon(kind) {
  return kind.includes('Command') ? TerminalSquare : FileText
}

/** Global search modal — opened via the navbar button or Ctrl/Cmd + K. */
export default function SearchBar() {
  const { open, setOpen, query, setQuery, results, go } = useSearch()
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30)
    else setQuery('')
  }, [open, setQuery])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => (document.body.style.overflow = '')
  }, [open])

  const grouped = useMemo(() => {
    const g = {}
    for (const r of results) (g[r.kind] ||= []).push(r)
    return g
  }, [results])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-lg border border-line bg-card px-3 py-2 text-sm text-mute transition-colors hover:border-acc/50 hover:text-ink md:flex"
        aria-label="Open search"
      >
        <Search size={15} className="text-acc" />
        Search docs…
        <kbd className="ml-6 hidden rounded border border-line bg-soft px-1.5 py-0.5 font-mono text-[10px] lg:inline">Ctrl K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
            onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <div className="absolute inset-0 bg-night-950/70 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.96, y: -8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, y: -6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-card shadow-2xl glow-soft"
            >
              <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                <Search size={17} className="shrink-0 text-acc" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (results[0]) go(results[0].path)
                      else go(`/search?q=${encodeURIComponent(query)}`)
                    }
                  }}
                  placeholder="Search SQL or MongoDB commands, lessons…"
                  className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-mute/60"
                  aria-label="Search query"
                />
                <button onClick={() => go(`/search?q=${encodeURIComponent(query)}`)} className="rounded border border-line px-1.5 py-0.5 text-[10px] font-medium text-mute hover:text-ink" aria-label="See all results">
                  Enter ↵ all results
                </button>
                <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-mute sm:block">ESC</kbd>
              </div>

              <div className="max-h-[50vh] overflow-y-auto p-2">
                {!query.trim() && (
                  <div className="px-3 py-8 text-center text-sm text-mute">
                    Try <code className="font-mono text-acc">JOIN</code>,{' '}
                    <code className="font-mono text-acc">$lookup</code>,{' '}
                    <code className="font-mono text-acc">index</code> or{' '}
                    <code className="font-mono text-acc">GROUP BY</code>
                  </div>
                )}
                {query.trim() && results.length === 0 && (
                  <div className="px-3 py-8 text-center text-sm text-mute">
                    No matches for “<span className="text-ink">{query}</span>”. Press Enter to browse everything anyway.
                  </div>
                )}
                {Object.entries(grouped).map(([kind, rows]) => (
                  <div key={kind} className="mb-1">
                    <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-mute">{kind}</p>
                    {rows.map((r) => {
                      const Icon = kindIcon(r.kind)
                      return (
                        <button
                          key={r.path + r.title}
                          onClick={() => go(r.path)}
                          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-soft focus-visible:bg-soft"
                        >
                          <Icon size={16} className="shrink-0 text-acc" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-mono text-sm font-medium text-ink">{r.title}</span>
                            <span className="block truncate text-xs text-mute">{r.snippet || r.sub}</span>
                          </span>
                          <ArrowUpRight size={14} className="text-mute opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 border-t border-line bg-soft px-4 py-2 text-[11px] text-mute">
                <span className="inline-flex items-center gap-1"><CornerDownLeft size={11} /> open first result</span>
                <span>↑↓ browse</span>
                <span className="ml-auto inline-flex items-center gap-1"><kbd className="rounded border border-line px-1 font-mono">Ctrl</kbd>+<kbd className="rounded border border-line px-1 font-mono">K</kbd> toggle</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
