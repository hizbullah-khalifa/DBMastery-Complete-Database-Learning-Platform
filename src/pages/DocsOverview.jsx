import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Compass, FileCode2, PlayCircle } from 'lucide-react'
import TopicCard from '../components/TopicCard.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { useProgress } from '../context/ProgressContext.jsx'
import useMeta from '../utils/meta.js'

/** Shared overview page for /sql and /mongodb: grouped lesson grids + quick links. */
export default function DocsOverview({ stack, topics, categories }) {
  const isSql = stack === 'sql'
  const label = isSql ? 'SQL' : 'MongoDB'
  const base = isSql ? '/sql' : '/mongodb'
  const accent = isSql ? 'text-cyan-500' : 'text-green-500'
  const ring = isSql
    ? 'hover:border-cyan-400/50 hover:shadow-cyan-500/10'
    : 'hover:border-green-400/50 hover:shadow-green-500/10'

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      {/* Header */}
      <header className="border-b border-line py-12 lg:py-16">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className={`font-mono text-xs font-bold uppercase tracking-[0.2em] ${accent}`}>
            {label} Documentation
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-ink sm:text-5xl">
            {isSql ? 'Learn SQL' : 'Learn MongoDB'}{' '}
            <span className="text-gradient">step by step</span>
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-mute">
            {isSql
              ? 'Master relational databases from your first CREATE DATABASE to window functions and normalization — with runnable examples in every lesson.'
              : 'Go from “what is a document?” to aggregation pipelines, indexes and Atlas deployment — everything a backend developer needs.'}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to={`${base}/cheatsheet`} className={`inline-flex items-center gap-2 rounded-lg border border-line bg-card px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 ${ring} hover:shadow-lg`}>
              <FileCode2 size={15} className={accent} /> {label} Cheatsheet
            </Link>
            <Link to="/explorer" className="inline-flex items-center gap-2 rounded-lg border border-line bg-card px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-acc/40 hover:shadow-lg">
              <Compass size={15} className="text-acc" /> Command Explorer
            </Link>
            {!isSql && (
              <Link to="/playground" className="inline-flex items-center gap-2 rounded-lg border border-line bg-card px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-acc/40 hover:shadow-lg">
                <PlayCircle size={15} className="text-acc" /> Playground
              </Link>
            )}
          </div>

          {/* category quick nav */}
          <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <a key={c} href={`#${c.toLowerCase().replace(/[^a-z]+/g, '-')}`} className="rounded-full border border-line bg-card px-3.5 py-1.5 font-mono text-[11px] font-medium text-mute transition-colors hover:border-acc/40 hover:text-acc">
                {c}
              </a>
            ))}
          </nav>
        </motion.div>
      </header>

      {/* Grouped topics */}
      {categories.map((cat) => {
        const items = topics.filter((t) => t.category === cat)
        if (!items.length) return null
        return (
          <section key={cat} id={cat.toLowerCase().replace(/[^a-z]+/g, '-')} className="scroll-mt-24 pt-14">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-ink">{cat}</h2>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-mute">{items.length} lessons</p>
              </div>
              <CategoryProgress items={items} stack={stack} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((t, i) => (
                <TopicCard key={t.slug} topic={t} base={base} index={i} />
              ))}
            </div>
          </section>
        )
      })}

      {/* Next path cross-link */}
      <footer className="mt-16 rounded-2xl border border-line bg-card p-7 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-ink">
            {isSql ? 'Done with SQL? Meet its NoSQL cousin →' : 'Want the relational view? Learn SQL next →'}
          </h2>
          <p className="mt-1 text-sm text-mute">Compare them side by side on the dedicated comparison page.</p>
        </div>
        <Link to="/compare" className="mt-4 inline-flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-sm font-bold text-night-950 shadow-md shadow-emerald-500/20 transition-transform hover:scale-[1.03] sm:mt-0">
          SQL vs MongoDB <ArrowRight size={15} />
        </Link>
      </footer>
    </div>
  )
}

function CategoryProgress({ items, stack }) {
  const progress = useProgress()
  const done = items.filter((t) => progress.isDone(t.slug)).length
  return (
    <div className="w-44">
      <ProgressBar
        value={Math.round((done / items.length) * 100)}
        stack={stack}
        showPercent={false}
        height="h-1.5"
        label={`${done}/${items.length} complete`}
      />
    </div>
  )
}
