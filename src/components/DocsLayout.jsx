import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft, CheckCircle2, ChevronRight, Clock3, Menu, X,
} from 'lucide-react'
import Sidebar from './Sidebar.jsx'
import Breadcrumbs from './Breadcrumbs.jsx'
import Blocks from './Blocks.jsx'
import ChallengeBox from './ChallengeBox.jsx'
import PrevNextNav from './PrevNextNav.jsx'
import ProgressBar from './ProgressBar.jsx'
import { diffColor } from './TopicCard.jsx'
import { useProgress } from '../context/ProgressContext.jsx'
import useMeta from '../utils/meta.js'

/**
 * Full documentation shell: breadcrumbs, mobile drawer sidebar,
 * desktop 3-column layout with "On this page" rail, lesson body,
 * mark-as-complete, challenge and prev/next navigation.
 */
export default function DocsLayout({ stack, topics, categories }) {
  const location = useLocation()
  const progress = useProgress()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Resolve current topic from the URL slug.
  const slug = location.pathname.split('/').pop()
  const idx = topics.findIndex((t) => t.slug === slug)
  const topic = topics[idx]
  const prev = idx > 0 ? topics[idx - 1] : null
  const next = idx < topics.length - 1 ? topics[idx + 1] : null
  const base = stack === 'sql' ? '/sql' : '/mongodb'
  const stackLabel = stack === 'sql' ? 'SQL' : 'MongoDB'
  const doneCount = topics.filter((t) => progress.isDone(t.slug)).length
  const pct = Math.round((doneCount / topics.length) * 100)

  useEffect(() => setDrawerOpen(false), [location])

  useEffect(() => {
    if (topic && window.innerWidth >= 768) progress.setLast(`${stackLabel}: ${topic.title}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  if (!topic) return null

  const isDone = progress.isDone(topic.slug)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Mobile docs toolbar */}
      <div className="flex items-center justify-between gap-2 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open lessons menu"
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-2 text-sm font-medium text-ink"
        >
          <Menu size={15} /> All Lessons
        </button>
        <span className="rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[11px] text-mute">
          {doneCount}/{topics.length} done
        </span>
      </div>

      <div className="lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[250px_minmax(0,1fr)_200px]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-8 pr-1">
            <Link to={base} className="mb-5 flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-acc/40 hover:text-acc">
              <ArrowLeft size={14} /> All {stackLabel} lessons
            </Link>
            <div className="mb-6 rounded-lg border border-line bg-card p-3">
              <ProgressBar value={pct} stack={stack} label={`${stackLabel} Progress`} />
            </div>
            <Sidebar topics={topics} categories={categories} base={base} currentSlug={slug} stack={stack} />
          </div>
        </aside>

        {/* Main article */}
        <article className="min-w-0 max-w-[760px] pt-4 lg:pt-8">
          <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: stackLabel, to: base }, { label: topic.category }, { label: topic.title }]} />

          <header className="border-b border-line pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${diffColor[topic.diff]}`}>
                {topic.diff}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-1 font-mono text-[11px] text-mute">
                <Clock3 size={11} /> {topic.minutes} min read
              </span>
              {isDone && (
                <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={12} /> Completed
                </motion.span>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{topic.title}</h1>
            <p className="mt-2 text-[15px] leading-relaxed text-mute">{topic.desc}</p>

            <button
              type="button"
              onClick={() => progress.toggleDone(topic.slug)}
              aria-pressed={isDone}
              className={`mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                isDone
                  ? 'bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/40 dark:text-emerald-400'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-night-950 shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-95'
              }`}
            >
              <CheckCircle2 size={16} />
              {isDone ? 'Completed ✓ — tap to undo' : 'Mark as Complete ✓'}
            </button>
          </header>

          {/* Sections */}
          {topic.sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="scroll-mt-24 pt-8">
              <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                <a href={`#${sec.id}`} className="group inline-flex items-center gap-2 outline-none">
                  {sec.heading}
                  <ChevronRight size={16} className="text-mute opacity-0 transition-opacity group-hover:opacity-60" />
                </a>
              </h2>
              <Blocks blocks={sec.blocks} />
            </section>
          ))}

          {topic.challenge && (
            <div id="challenge-anchor" className="scroll-mt-24 pt-4">
              <ChallengeBox challenge={topic.challenge} />
            </div>
          )}

          <PrevNextNav prev={prev} next={next} base={base} />
        </article>

        {/* On this page */}
        <aside className="hidden xl:block" aria-label="On this page">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto py-8 pl-2">
            <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-mute">
              <ChevronRight size={12} /> On This Page
            </p>
            <ul className="space-y-1 border-l border-line">
              {topic.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent py-1 pl-3 text-[13px] leading-snug text-mute transition-colors hover:border-acc hover:text-acc">
                    {s.heading}
                  </a>
                </li>
              ))}
              {topic.challenge && (
                <li>
                  <a href="#challenge-anchor" className="-ml-px block border-l-2 border-transparent py-1 pl-3 text-[13px] text-mute hover:border-acc hover:text-acc">Practice Challenge</a>
                </li>
              )}
            </ul>
          </div>
        </aside>
      </div>

      {/* Mobile drawer for lessons */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onMouseDown={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[70] bg-night-950/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-[71] w-[290px] overflow-y-auto border-r border-line bg-card p-4 lg:hidden"
              aria-label="Lessons drawer"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold text-ink">{stackLabel} Lessons</span>
                <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="rounded-md p-1.5 text-mute hover:bg-soft hover:text-ink">
                  <X size={17} />
                </button>
              </div>
              <Sidebar topics={topics} categories={categories} base={base} currentSlug={slug} stack={stack} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
