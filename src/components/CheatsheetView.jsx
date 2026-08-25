import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CodeBlock from './CodeBlock.jsx'
import CopyButton from './CopyButton.jsx'
import { useProgress } from '../context/ProgressContext.jsx'

function anchor(name) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

/** Shared renderer for a cheatsheet: sticky category nav + command cards. */
export default function CheatsheetView({ stack, categories }) {
  const isSql = stack === 'sql'
  const label = isSql ? 'SQL' : 'MongoDB'

  return (
    <div className="grid gap-8 lg:grid-cols-[210px_minmax(0,1fr)]">
      {/* category rail */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6">
          <p className="mb-2 px-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-mute">Categories</p>
          <ul className="space-y-0.5 border-l border-line">
            {categories.map((c) => (
              <li key={c.name}>
                <a href={`#${anchor(c.name)}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-3 text-[13px] text-mute transition-colors hover:border-acc hover:text-acc">
                  {c.name}
                  <span className="ml-1.5 font-mono text-[10px] opacity-60">{c.commands.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div>
        {categories.map((cat, ci) => (
          <section key={cat.name} id={anchor(cat.name)} className="scroll-mt-20 border-b border-line py-8 first:pt-0 last:border-0">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                  <span className="mr-2 font-mono text-sm text-mute">{String(ci + 1).padStart(2, '0')}</span>
                  {cat.name}
                </h2>
                <span className="rounded-full bg-soft px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wide text-mute">{cat.commands.length} commands</span>
              </div>
              <p className="mt-1 text-sm text-mute">{cat.blurb}</p>

              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                {cat.commands.map((c) => (
                  <article key={c.cmd + c.syntax} className="group flex flex-col rounded-xl border border-line bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-acc/40 hover:shadow-lg hover:shadow-emerald-500/5">
                    <header className="flex items-center justify-between gap-2">
                      <h3 className="truncate font-mono text-[15px] font-extrabold text-ink transition-colors group-hover:text-acc">{c.cmd}</h3>
                      <CopyButton text={c.example || c.syntax} />
                    </header>
                    <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-mute">{c.desc}</p>
                    <CodeBlock lang={isSql ? 'sql' : 'js'} title={`${c.cmd.split(' ')[0].toLowerCase()}.${isSql ? 'sql' : 'js'}`} code={c.example} />
                    <details className="mt-1">
                      <summary className="cursor-pointer select-none font-mono text-[11px] uppercase tracking-wider text-mute transition-colors hover:text-acc">Syntax</summary>
                      <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-base p-2.5 font-mono text-[12px] text-ink">{c.syntax}</pre>
                    </details>
                  </article>
                ))}
              </div>
            </motion.div>
          </section>
        ))}

        <footer className="pt-8 text-center">
          <p className="text-sm text-mute">Want these as lessons instead? Browse the full{' '}
            <Link to={isSql ? '/sql' : '/mongodb'} className="font-semibold text-acc hover:underline">{label} course</Link>.
          </p>
        </footer>
      </div>
    </div>
  )
}

/** Tabbed wrapper used by the combined /cheatsheets route. */
export function CheatsheetTabs({ sqlCats, mongoCats }) {
  const [tab, setTab] = useState('sql')
  return (
    <div>
      <div className="mx-auto mb-8 flex w-fit rounded-xl border border-line bg-card p-1" role="tablist" aria-label="Choose cheatsheet">
        {[
          ['sql', 'SQL'],
          ['mongo', 'MongoDB'],
        ].map(([key, lab]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`relative rounded-lg px-6 py-2.5 text-sm font-bold transition-colors ${
              tab === key ? 'text-night-950' : 'text-mute hover:text-ink'
            }`}
          >
            {tab === key && (
              <motion.span
                layoutId="cheat-tab"
                className={`absolute inset-0 rounded-lg bg-gradient-to-r ${key === 'sql' ? 'from-cyan-400 to-blue-500' : 'from-green-500 to-emerald-300'}`}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{lab}</span>
          </button>
        ))}
      </div>
      <CheatsheetView key={tab} stack={tab} categories={tab === 'sql' ? sqlCats : mongoCats} />
    </div>
  )
}

/** Records a cheat-sheet visit for the home dashboard. */
export function useCheatVisit(kind) {
  const progress = useProgress()
  useEffect(() => {
    progress.recordVisit(kind)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind])
}
