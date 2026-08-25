import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, BookOpenCheck, Boxes, ChevronRight, Compass, Database,
  FileCode2, GraduationCap, Layers, ListChecks, Sparkles, Table2, Target, Trophy,
} from 'lucide-react'
import HeroEditor from '../components/HeroEditor.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { sqlTopics, mongoTopics } from '../data/index.js'
import useMeta from '../utils/meta.js'
import { useProgress } from '../context/ProgressContext.jsx'

const FEATURES = [
  { icon: BookOpenCheck, title: 'Clear Explanations', text: 'Every lesson defines the concept in plain language before showing a single command — no jargon walls.' },
  { icon: FileCode2, title: 'Copy-Ready Commands', text: 'IDE-style code blocks with syntax highlighting and one-click copy for every example and cheatsheet entry.' },
  { icon: ListChecks, title: 'Practice Challenges', text: 'Interactive challenges check your answer instantly — with hints and solutions when you get stuck.' },
  { icon: Compass, title: 'Command Explorer', text: 'One searchable place for every SQL and MongoDB command, filterable by database and difficulty.' },
  { icon: Trophy, title: 'Progress Tracking', text: 'Mark lessons complete and watch your SQL & MongoDB progress grow. Saved locally, no account needed.' },
  { icon: GraduationCap, title: 'Beginner → Advanced', text: 'A structured path from “what is a table?” to window functions and aggregation pipelines.' },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.45 },
}

export default function Home() {
  useMeta('Master SQL & MongoDB', 'Learn relational and NoSQL databases through clear explanations, practical examples, commands, cheatsheets, and interactive exploration.')
  const progress = useProgress()

  // Smooth-scroll when landing via /#learning-paths etc.
  useEffect(() => {
    if (window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-2 lg:pb-28 lg:pt-24">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5"
            >
              <Sparkles size={13} className="text-emerald-400" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">Database Learning Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-5 text-[2.6rem] font-black leading-[1.05] tracking-tight text-ink sm:text-6xl"
            >
              Master SQL & MongoDB
              <span className="text-gradient mt-2 block text-[1.7rem] leading-snug sm:text-4xl">
                From First Query to Advanced Database Concepts.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-5 max-w-xl text-lg leading-relaxed text-mute"
            >
              Learn relational and NoSQL databases through clear explanations, practical examples, commands, cheatsheets, and interactive exploration.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/sql/introduction"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3.5 text-[15px] font-bold text-night-950 shadow-xl shadow-emerald-500/25 transition-transform hover:scale-[1.03] active:scale-95"
              >
                Start Learning <ArrowRight size={17} />
              </Link>
              <Link
                to="/cheatsheets"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-acc/50 hover:text-acc"
              >
                Explore Cheatsheet
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="mt-6 flex items-center gap-5 text-sm font-medium"
            >
              <Link to="/sql" className="group inline-flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                Browse SQL <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/mongodb" className="group inline-flex items-center gap-1.5 text-green-600 dark:text-green-400">
                Browse MongoDB <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 flex flex-wrap gap-6 border-t border-line pt-5">
              {[['60+', 'lessons'], ['70+', 'commands'], ['25+', 'challenges']].map(([n, l]) => (
                <div key={l}>
                  <p className="font-mono text-xl font-extrabold text-ink">{n}</p>
                  <p className="text-xs uppercase tracking-wider text-mute">{l}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <HeroEditor />
          </motion.div>
        </div>
      </section>

      {/* ── Learning Paths ──────────────────────────────────────────────── */}
      <section id="learning-paths" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
        <motion.div {...fadeUp} className="mb-10 text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-acc">Learning Paths</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Two databases. One mastery journey.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-mute">Pick a path and follow it top to bottom — every lesson builds on the previous one.</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* SQL card */}
          <motion.div
            initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="group relative overflow-hidden rounded-2xl border border-line bg-card p-7 transition-shadow hover:shadow-2xl hover:shadow-cyan-500/10"
          >
            <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl transition-opacity group-hover:opacity-100" />
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/25">
                <Table2 size={22} />
              </span>
              <ProgressBar value={progress.sqlPct} stack="sql" showPercent={false} height="h-1.5 w-28" label="" />
            </div>
            <h3 className="mt-4 text-2xl font-extrabold text-ink">
              SQL Path <span className="ml-2 rounded-md bg-cyan-500/10 px-2 py-0.5 align-middle font-mono text-[11px] font-bold text-cyan-500">{sqlTopics.length} lessons</span>
            </h3>
            <p className="mt-2 leading-relaxed text-mute">
              Master relational databases, tables, relationships, queries, joins, constraints, transactions, and advanced SQL.
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {['Introduction','Databases','Tables','Data Types','Keys','Constraints','SELECT','WHERE','ORDER BY','GROUP BY','JOINs','Subqueries','Functions','Transactions','Indexes','Advanced SQL'].map((t) => (
                <li key={t} className="rounded-md bg-soft px-2 py-1 font-mono text-[11px] text-mute">{t}</li>
              ))}
            </ul>
            <Link to="/sql" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan-500/10 px-4 py-2.5 text-sm font-bold text-cyan-600 ring-1 ring-cyan-500/30 transition-all hover:bg-cyan-500 hover:text-night-950 dark:text-cyan-400">
              Learn SQL →
            </Link>
          </motion.div>

          {/* MongoDB card */}
          <motion.div
            initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-line bg-card p-7 transition-shadow hover:shadow-2xl hover:shadow-green-500/10"
          >
            <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-green-500/10 blur-3xl" />
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-300 text-night-950 shadow-lg shadow-green-500/25">
                <Layers size={22} />
              </span>
              <ProgressBar value={progress.mongoPct} stack="mongo" showPercent={false} height="h-1.5 w-28" label="" />
            </div>
            <h3 className="mt-4 text-2xl font-extrabold text-ink">
              MongoDB Path <span className="ml-2 rounded-md bg-green-500/10 px-2 py-0.5 align-middle font-mono text-[11px] font-bold text-green-500">{mongoTopics.length} lessons</span>
            </h3>
            <p className="mt-2 leading-relaxed text-mute">
              Learn MongoDB from documents and collections to aggregation pipelines, indexes, relationships, and production-ready queries.
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {['Introduction','NoSQL Concepts','Database','Collections','Documents','BSON','CRUD','Operators','Query Filters','Sorting','Projection','Arrays','Embedded Docs','References','Aggregation','Indexes','Transactions','Atlas','Mongoose'].map((t) => (
                <li key={t} className="rounded-md bg-soft px-2 py-1 font-mono text-[11px] text-mute">{t}</li>
              ))}
            </ul>
            <Link to="/mongodb" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2.5 text-sm font-bold text-green-700 ring-1 ring-green-500/30 transition-all hover:bg-green-500 hover:text-night-950 dark:text-green-400">
              Learn MongoDB →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section className="border-y border-line bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <motion.div {...fadeUp} className="mb-10 max-w-2xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-acc">Why DBMastery</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Documentation that teaches. Tools that keep you practicing.</h2>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                className="rounded-xl border border-line bg-card p-5 transition-colors hover:border-acc/40"
              >
                <f.icon size={20} className="text-acc" />
                <h3 className="mt-3 font-bold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mute">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Progress dashboard ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div {...fadeUp}>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-acc">Your Learning Progress</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Small steps, tracked forever.</h2>
            <p className="mt-3 max-w-lg leading-relaxed text-mute">
              Mark lessons as you finish them and your progress lives right here — stored privately in your browser. No login, no cloud, no excuses.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-sm">
              <StatTile icon={<BookOpenCheck size={16} />} value={`${progress.totalDone}/${progress.totalLessons}`} label="Lessons done" />
              <StatTile icon={<Target size={16} />} value={progress.lastTopic ? progress.lastTopic.split(': ')[1].slice(0, 18) + (progress.lastTopic.split(': ')[1].length > 18 ? '…' : '') : '—'} label="Current topic" mono={false} />
              <StatTile icon={<FileCode2 size={16} />} value={`${progress.visitsSql}`} label="SQL cheat visits" />
              <StatTile icon={<FileCode2 size={16} />} value={`${progress.visitsMongo}`} label="Mongo cheat visits" />
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="space-y-5 rounded-2xl border border-line bg-card p-6 sm:p-8 glow-soft">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-semibold text-ink"><Table2 size={16} className="text-cyan-500" /> SQL Progress</span>
                <Link to="/sql" className="text-xs font-medium text-mute hover:text-acc">continue →</Link>
              </div>
              <ProgressBar value={progress.sqlPct} stack="sql" label={`${progress.sqlDone} of ${sqlTopics.length} lessons`} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-semibold text-ink"><Layers size={16} className="text-green-500" /> MongoDB Progress</span>
                <Link to="/mongodb" className="text-xs font-medium text-mute hover:text-acc">continue →</Link>
              </div>
              <ProgressBar value={progress.mongoPct} stack="mongo" label={`${progress.mongoDone} of ${mongoTopics.length} lessons`} />
            </div>
            <p className="border-t border-line pt-4 font-mono text-[11px] leading-relaxed text-mute">
              █░ visualized above · resets only if you clear browser data
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <motion.div
          {...fadeUp}
          className="glow-acc relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-night-900 to-night-950 p-8 text-center sm:p-14"
        >
          <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
          <Boxes size={34} className="mx-auto text-emerald-400" />
          <h2 className="relative mt-4 text-3xl font-extrabold tracking-tight text-slate-50 sm:text-4xl">
            Ready to explore every command?
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-slate-400">
            The Command Explorer indexes every SQL and MongoDB command on this site — searchable, filterable and copy-ready.
          </p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/explorer" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3.5 text-[15px] font-bold text-night-950 shadow-xl shadow-emerald-500/25 transition-transform hover:scale-[1.03] active:scale-95">
              <Compass size={17} /> Open Command Explorer
            </Link>
            <Link to="/playground" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-[15px] font-semibold text-slate-200 transition-colors hover:bg-white/10">
              Try the Playground
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

function StatTile({ icon, value, label, mono = true }) {
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <span className="flex items-center gap-1.5 text-acc">{icon}</span>
      <p className={`mt-1.5 truncate text-lg font-extrabold ${mono ? 'font-mono' : ''} text-ink`} title={String(value)}>{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-mute">{label}</p>
    </div>
  )
}
