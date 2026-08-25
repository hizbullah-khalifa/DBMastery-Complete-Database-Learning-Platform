import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Filter, Search, X } from 'lucide-react'
import CodeBlock from './CodeBlock.jsx'
import CopyButton from './CopyButton.jsx'
import { allCommands, stackMeta } from '../data/index.js'
import { diffColor } from './TopicCard.jsx'

const STACK_FILTERS = ['All', 'SQL', 'MongoDB']
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']

/** Searchable, filterable explorer over every SQL + MongoDB command. */
export default function CommandExplorer({ initialQuery = '', initialStack = 'All' }) {
  const commands = useMemo(() => allCommands(), [])
  const [query, setQuery] = useState(initialQuery)
  const [stack, setStack] = useState(initialStack)
  const [level, setLevel] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return commands.filter((c) => {
      if (stack !== 'All' && stackMeta[c.stack].label !== stack) return false
      if (level !== 'All' && c.diff !== level) return false
      if (!q) return true
      return `${c.cmd} ${c.desc} ${c.category}`.toLowerCase().includes(q)
    })
  }, [commands, query, stack, level])

  const related = (cmd) =>
    commands
      .filter((c) => c !== cmd && c.stack === cmd.stack && c.category === cmd.category)
      .slice(0, 4)

  return (
    <div>
      {/* Controls */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search SQL or MongoDB command… e.g. JOIN, find(), $lookup"
            aria-label="Search commands"
            className="w-full rounded-xl border border-line bg-card py-3 pl-10 pr-4 text-[15px] text-ink outline-none transition-colors placeholder:text-mute/60 focus:border-acc"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-mute"><Filter size={12} /> Filters</span>
          <div className="flex rounded-lg border border-line bg-card p-0.5" role="group" aria-label="Filter by database type">
            {STACK_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setStack(f)}
                aria-pressed={stack === f}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  stack === f ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-night-950' : 'text-mute hover:text-ink'
                }`}
              >
                {f === 'MongoDB' ? 'MongoDB' : f}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border border-line bg-card p-0.5" role="group" aria-label="Filter by difficulty">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                aria-pressed={level === l}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  level === l ? 'bg-soft text-acc ring-1 ring-line' : 'text-mute hover:text-ink'
                }`}
              >
                {l === 'All' ? 'Any Level' : l}
              </button>
            ))}
          </div>
          <span className="ml-auto font-mono text-xs text-mute">{filtered.length} commands</span>
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((c) => (
            <motion.button
              key={c.stack + c.cmd + c.category}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              onClick={() => setSelected(c)}
              className="group flex flex-col rounded-xl border border-line bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-acc/40 hover:shadow-lg hover:shadow-emerald-500/5 focus-visible:-translate-y-0.5"
            >
              <div className="flex w-full items-center justify-between gap-2">
                <code className="truncate font-mono text-[13.5px] font-bold text-ink group-hover:text-acc">{c.cmd}</code>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${diffColor[c.diff]}`}>
                  {c.diff}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 w-full text-[13px] leading-relaxed text-mute">{c.desc}</p>
              <div className="mt-3 flex w-full items-center gap-1.5 border-t border-line pt-2.5">
                <span className={`h-1.5 w-1.5 rounded-full ${c.stack === 'sql' ? 'bg-cyan-400' : 'bg-green-400'}`} />
                <span className="text-[11px] font-medium text-mute">{stackMeta[c.stack].label} · {c.category}</span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-line p-12 text-center">
          <p className="font-mono text-sm text-mute">No command matches “{query}”. Try a shorter term.</p>
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}
            className="fixed inset-0 z-[90] flex items-end justify-center bg-night-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            role="dialog" aria-modal="true" aria-label={`${selected.cmd} details`}
          >
            <motion.div
              initial={{ y: 40, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.98, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-line bg-card shadow-2xl sm:rounded-2xl"
            >
              <header className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-card/95 px-5 py-4 backdrop-blur">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="font-mono text-xl font-extrabold text-ink">{selected.cmd}</code>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${diffColor[selected.diff]}`}>{selected.diff}</span>
                  </div>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-mute">
                    <BookOpen size={12} />
                    {stackMeta[selected.stack].label} Cheatsheet · {selected.category}
                    {selected.danger && <span className="ml-1 rounded bg-rose-500/15 px-1.5 py-0.5 font-semibold text-rose-500">destructive</span>}
                  </p>
                </div>
                <button onClick={() => setSelected(null)} aria-label="Close details" className="rounded-lg p-1.5 text-mute transition-colors hover:bg-soft hover:text-ink">
                  <X size={18} />
                </button>
              </header>

              <div className="px-5 py-4">
                <p className="text-[15px] leading-relaxed text-mute">{selected.desc}</p>

                <h3 className="mt-5 mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-mute">Syntax</h3>
                <CodeBlock lang={selected.stack === 'sql' ? 'sql' : 'js'} title="syntax" code={selected.syntax} lines={false} />

                <h3 className="mt-5 mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-mute">Example</h3>
                <div className="relative">
                  <CodeBlock lang={selected.stack === 'sql' ? 'sql' : 'js'} title={`example.${selected.stack === 'sql' ? 'sql' : 'js'}`} code={selected.example} />
                  <div className="pointer-events-none absolute right-3 top-12 opacity-0 transition-opacity hover:opacity-100"><CopyButton text={selected.example} label /></div>
                </div>

                <h3 className="mt-5 mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-mute">Related Commands</h3>
                <div className="flex flex-wrap gap-2 pb-2">
                  {related(selected).map((r) => (
                    <button
                      key={r.cmd}
                      onClick={() => setSelected(r)}
                      className="rounded-lg border border-line bg-soft px-3 py-1.5 font-mono text-xs text-mute transition-colors hover:border-acc/40 hover:text-acc"
                    >
                      {r.cmd}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
