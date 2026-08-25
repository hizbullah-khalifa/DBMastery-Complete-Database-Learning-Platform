import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpenCheck, Code2, Database, FileCode2, GraduationCap, Hammer, Lightbulb, ListChecks } from 'lucide-react'
import useMeta from '../utils/meta.js'

const STEPS = [
  { icon: BookOpenCheck, title: 'Learn', text: 'Plain-language explanations define every concept before any syntax appears.' },
  { icon: ListChecks, title: 'Practice', text: 'Copy real commands into the playground and solve challenges with instant feedback.' },
  { icon: Lightbulb, title: 'Understand', text: 'Line-by-line breakdowns and “how it works” notes turn syntax into intuition.' },
  { icon: Hammer, title: 'Build', text: 'Take the patterns to your own apps — schemas, queries and pipelines you can defend.' },
]

const PRINCIPLES = [
  'Simple explanations first — jargon only after the idea is clear.',
  'Realistic examples drawn from apps you would actually build.',
  'Every command copyable, every lesson practical.',
  'SQL and MongoDB treated as equally important skills.',
  'Progress belongs to the learner — stored locally, never gated.',
]

export default function About() {
  useMeta('About DBMastery', 'DBMastery helps developers and students truly understand databases through simple explanations, practical commands and interactive learning.')

  useEffect(() => window.scrollTo(0, 0), [])

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-12 sm:px-6">
      {/* Header */}
      <header className="text-center">
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-night-950 shadow-xl shadow-emerald-500/25"
        >
          <Database size={30} strokeWidth={2.25} />
        </motion.span>
        <motion.h1 initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }} className="mt-5 text-4xl font-black tracking-tight text-ink sm:text-5xl">
          About <span className="text-gradient">DBMastery</span>
        </motion.h1>
        <p className="mx-auto mt-3 max-w-2xl font-mono text-sm text-mute">Master SQL & MongoDB — one concept at a time.</p>
      </header>

      {/* Mission */}
      <section className="prose-intro mt-10 rounded-2xl border border-line bg-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-ink">Why this platform exists</h2>
        <p className="mt-3 leading-relaxed text-mute">
          Most developers learn databases by copying snippets that “work” without understanding why. DBMastery is built to fix
          that. It is a documentation-style learning platform designed to help students and working developers genuinely
          understand how relational and document databases think.
        </p>
        <ul className="mt-4 space-y-2">
          {[
            ['simple explanations', 'every idea is introduced in plain language'],
            ['practical commands', 'real syntax for MySQL/Postgres and mongosh'],
            ['real-world examples', 'queries taken from dashboards, shops and feeds'],
            ['cheatsheets', 'the entire language at your fingertips'],
            ['interactive learning', 'challenges, explorer and playground'],
          ].map(([strong, rest]) => (
            <li key={strong} className="flex gap-2.5 text-[15px] leading-relaxed text-mute">
              <span aria-hidden className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
              <span><strong className="font-semibold text-ink">{strong}</strong> — {rest}.</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Method */}
      <section className="mt-12">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Learn → Practice → Understand → Build</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-xl border border-line bg-card p-5"
            >
              <span className="absolute right-4 top-3 font-mono text-3xl font-black text-line">{i + 1}</span>
              <s.icon size={20} className="text-acc" />
              <h3 className="mt-3 font-extrabold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-mute">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Principles + stack */}
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-6">
          <GraduationCap size={20} className="text-acc" />
          <h2 className="mt-2 text-lg font-bold text-ink">What we believe</h2>
          <ul className="mt-3 space-y-2.5">
            {PRINCIPLES.map((p) => (
              <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-mute">
                <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-acc" />{p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-card p-6">
          <Code2 size={20} className="text-acc" />
          <h2 className="mt-2 text-lg font-bold text-ink">Built with</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Router', 'Lucide Icons'].map((t) => (
              <span key={t} className="rounded-lg border border-line bg-soft px-3 py-1.5 font-mono text-xs text-mute">{t}</span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-mute">
            A fully client-side experience: lessons, search and progress all run in your browser. Playground results are clearly labeled as simulated demo data.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-night-900 to-night-950 p-8 text-center">
        <FileCode2 size={22} className="text-emerald-400" />
        <p className="font-semibold text-slate-200">Ready to start from the very first query?</p>
        <Link to="/sql/introduction" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-bold text-night-950 shadow-md shadow-emerald-500/25 transition-transform hover:scale-[1.03]">
          Start Learning →
        </Link>
      </div>
    </div>
  )
}
