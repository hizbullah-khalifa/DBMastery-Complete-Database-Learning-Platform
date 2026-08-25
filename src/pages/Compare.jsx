import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Database, Layers } from 'lucide-react'
import CodeBlock from '../components/CodeBlock.jsx'
import useMeta from '../utils/meta.js'

const MAPPING = [
  ['Database', 'Database'],
  ['Table', 'Collection'],
  ['Row', 'Document'],
  ['Column', 'Field'],
  ['Primary Key', '_id'],
  ['JOIN', '$lookup / embedding'],
  ['SQL Query', 'MongoDB Query'],
  ['Schema-based', 'Flexible schema'],
]

export default function Compare() {
  useMeta('SQL vs MongoDB', 'Interactive comparison of SQL and MongoDB: terminology mapping, philosophy and the same query written for both worlds.')
  const [focus, setFocus] = useState('sql')

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6">
      <header className="text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-acc">Head to Head</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-ink sm:text-5xl">
          SQL <span className="text-gradient">vs</span> MongoDB
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-mute">Tap a side to spotlight it — then study how the same concepts translate between both worlds.</p>
      </header>

      {/* Animated toggle */}
      <div className="mt-8 flex justify-center">
        <div className="relative flex rounded-2xl border border-line bg-card p-1.5" role="tablist" aria-label="Focus database">
          {[
            ['sql', 'SQL', 'from-cyan-400 to-blue-500'],
            ['mongo', 'MongoDB', 'from-green-500 to-emerald-300'],
          ].map(([key, label, grad]) => (
            <button
              key={key}
              role="tab"
              aria-selected={focus === key}
              onClick={() => setFocus(key)}
              className={`relative z-10 inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-bold transition-colors ${
                focus === key ? 'text-night-950' : 'text-mute hover:text-ink'
              }`}
            >
              {focus === key && (
                <motion.span
                  layoutId="compare-pill"
                  className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-r ${grad} shadow-lg`}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              {key === 'sql' ? <Database size={15} /> : <Layers size={15} />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Concept cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={focus}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28 }}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {MAPPING.map(([sqlTerm, mongoTerm], i) => {
            const active = focus === 'sql' ? sqlTerm : mongoTerm
            const other = focus === 'sql' ? mongoTerm : sqlTerm
            return (
              <motion.div
                key={active + i}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-line bg-card p-4 text-center"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-mute">{focus === 'sql' ? 'SQL' : 'MongoDB'}</p>
                <p className={`mt-1 font-mono text-[15px] font-extrabold ${focus === 'sql' ? 'text-cyan-500' : 'text-green-500'}`}>{active}</p>
                <p className="my-2 flex items-center justify-center gap-2 text-mute/70" aria-hidden>
                  <ArrowLeft size={11} /> ↔ <ArrowRight size={11} />
                </p>
                <p className="font-mono text-[12px] text-mute">{other}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* Same query, two worlds */}
      <section className="mt-16">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Same question, two dialects</h2>
        <p className="mt-2 text-center text-mute">“Total completed revenue per user” — first as a JOIN, then as an aggregation pipeline.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-cyan-500/20 p-5">
            <p className="mb-2 inline-flex items-center gap-2 font-semibold text-cyan-600 dark:text-cyan-400"><Database size={15} /> SQL way</p>
            <CodeBlock lang="sql" title="revenue.sql" code={`SELECT users.name,\n       SUM(orders.amount) AS total\nFROM users\nINNER JOIN orders ON orders.user_id = users.id\nWHERE orders.status = 'completed'\nGROUP BY users.name;`} />
          </div>
          <div className="rounded-2xl border border-green-500/20 p-5">
            <p className="mb-2 inline-flex items-center gap-2 font-semibold text-green-600 dark:text-green-400"><Layers size={15} /> MongoDB way</p>
            <CodeBlock lang="js" title="revenue.js" code={`db.orders.aggregate([
    {
        $match: { status: "completed" }
    },
    {
        $group: {
            _id: "$userId",
            total: { $sum: "$amount" }
        }
    }
])`} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-16 flex flex-wrap justify-center gap-3">
        <Link to="/sql/introduction" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-bold text-night-950 shadow-md shadow-emerald-500/20 transition-transform hover:scale-[1.03]">
          Start with SQL →
        </Link>
        <Link to="/mongodb/introduction" className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-acc/40 hover:text-acc">
          Or dive into MongoDB →
        </Link>
      </div>
    </div>
  )
}
