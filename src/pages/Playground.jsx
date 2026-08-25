import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CircleAlert, Play, RotateCcw } from 'lucide-react'
import CodeBlock from '../components/CodeBlock.jsx'
import useMeta from '../utils/meta.js'

const USERS = [
  { id: 1, name: 'Ali', email: 'ali@example.com', age: 22, status: 'active' },
  { id: 2, name: 'Sara', email: 'sara@example.com', age: 27, status: 'active' },
  { id: 3, name: 'Ahmad', email: 'ahmad@example.com', age: 16, status: 'guest' },
  { id: 4, name: 'Zara', email: 'zara@example.com', age: 31, status: 'banned' },
  { id: 5, name: 'Hina', email: 'hina@example.com', age: 19, status: 'active' },
]
const ORDERS = [
  { id: 10, user_id: 1, amount: 250 },
  { id: 11, user_id: 2, amount: 400 },
  { id: 12, user_id: 1, amount: 100 },
  { id: 13, user_id: 5, amount: 320 },
]
const PRODUCTS = [
  { id: 1, name: 'Laptop', category: 'electronics', price: 999.99 },
  { id: 2, name: 'Mouse', category: 'electronics', price: 19.5 },
  { id: 3, name: 'Desk', category: 'furniture', price: 149 },
]

const SQL_PRESETS = [
  { label: 'All users', code: 'SELECT * FROM users;' },
  { label: 'Adults only', code: 'SELECT * FROM users\nWHERE age > 18;' },
  { label: 'Orders per user', code: `SELECT users.name, COUNT(orders.id) AS total_orders
FROM users
INNER JOIN orders ON users.id = orders.user_id
GROUP BY users.name
ORDER BY total_orders DESC;` },
  { label: 'Sorted products', code: 'SELECT name, price FROM products\nORDER BY price DESC;' },
]
const MONGO_PRESETS = [
  { label: 'All users', code: 'db.users.find()' },
  { label: 'Adults only', code: `db.users.find({
    age: {
        $gt: 18
    }
})` },
  { label: 'Name + email', code: 'db.users.find({}, { name: 1, email: 1, _id: 0 })' },
  { label: 'Active sorted by age', code: 'db.users.find({ status: "active" }).sort({ age: -1 })' },
]

function ResultTable({ rows, cols }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left font-mono text-[12px]">
        <thead>
          <tr className="bg-soft">
            {cols.map((c) => (
              <th key={c} scope="col" className="px-3 py-2 font-semibold text-ink">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line/60">
              {cols.map((c) => (
                <td key={c} className="whitespace-nowrap px-3 py-2 text-mute">{String(r[c])}</td>
              ))}
            </tr>
          ))}
          {!rows.length && (
            <tr><td colSpan={cols.length} className="px-3 py-6 text-center text-mute">(0 rows returned)</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default function Playground() {
  useMeta('Code Playground', 'Write SQL or MongoDB queries against sample data and see simulated results instantly — a risk-free place to practice.')
  const [tab, setTab] = useState('sql')
  const [code, setCode] = useState(SQL_PRESETS[0].code)
  const [result, setResult] = useState(null)
  const [ranAt, setRanAt] = useState(null)

  const presets = tab === 'sql' ? SQL_PRESETS : MONGO_PRESETS

  const run = () => {
    const c = code.toLowerCase().replace(/\s+/g, ' ')
    if (tab === 'sql') {
      if (c.includes('join')) {
        const counts = {}
        for (const o of ORDERS) {
          const u = USERS.find((x) => x.id === o.user_id)
          if (u) counts[u.name] = (counts[u.name] || 0) + 1
        }
        const rows = Object.entries(counts).map(([name, n]) => ({ name, total_orders: n })).sort((a, b) => b.total_orders - a.total_orders)
        setResult({ kind: 'table', cols: ['name', 'total_orders'], rows })
      } else if (c.includes('products') && c.includes('order by')) {
        const rows = [...PRODUCTS].sort((a, b) => b.price - a.price).map((p) => ({ name: p.name, price: p.price }))
        setResult({ kind: 'table', cols: ['name', 'price'], rows })
      } else if (c.includes('age') && (c.includes('>') || c.includes('>='))) {
        setResult({ kind: 'table', cols: Object.keys(USERS[0]), rows: USERS.filter((u) => u.age > 18 || (u.age >= 18 && c.includes('>='))) })
      } else {
        setResult({ kind: 'table', cols: Object.keys(USERS[0]), rows: USERS })
      }
    } else {
      if (c.includes('$gt') || c.includes('$gte')) {
        const op = c.includes('$gte') ? 18 : 18
        const strict = !c.includes('=')
        setResult({ kind: 'json', docs: USERS.filter((u) => (strict ? u.age > op : u.age >= op)) })
      } else if (c.includes('"name": 1') || c.includes('name: 1')) {
        setResult({ kind: 'json', docs: USERS.map(({ name, email }) => ({ name, email })) })
      } else if (c.includes('status') && c.includes('sort')) {
        setResult({ kind: 'json', docs: [...USERS].filter((u) => u.status === 'active').sort((a, b) => b.age - a.age) })
      } else {
        setResult({ kind: 'json', docs: USERS })
      }
    }
    setRanAt(new Date())
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6">
      <header className="mb-8">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-acc">Risk-Free Practice</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-ink sm:text-5xl">
          Code <span className="text-gradient">Playground</span>
        </h1>
        <p className="mt-3 max-w-2xl text-mute">
          Write queries against the sample dataset and hit <strong className="text-ink">Run Example</strong>. The playground recognizes common query shapes and shows a simulated result — no real database connected.
        </p>
      </header>

      {/* Tabs */}
      <div className="mb-6 flex w-fit rounded-xl border border-line bg-card p-1" role="tablist" aria-label="Playground language">
        {[['sql', 'SQL'], ['mongo', 'MongoDB']].map(([k, lab]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => { setTab(k); setCode(k === 'sql' ? SQL_PRESETS[0].code : MONGO_PRESETS[0].code); setResult(null) }}
            className={`rounded-lg px-6 py-2.5 text-sm font-bold transition-colors ${tab === k ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-night-950' : 'text-mute hover:text-ink'}`}
          >
            {lab}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor side */}
        <section aria-label="Editor">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button key={p.label} onClick={() => { setCode(p.code); setResult(null) }} className="rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[11.5px] text-mute transition-colors hover:border-acc/40 hover:text-acc">
                {p.label}
              </button>
            ))}
          </div>
          <label htmlFor="playground-code" className="sr-only">Query editor</label>
          <textarea
            id="playground-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            rows={14}
            className="w-full resize-y rounded-xl border border-line bg-[#0a1020] p-4 font-mono text-[13px] leading-relaxed text-slate-200 outline-none focus:border-emerald-500/50"
          />
          <div className="mt-3 flex items-center gap-3">
            <button onClick={run} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-bold text-night-950 shadow-md shadow-emerald-500/20 transition-transform hover:scale-[1.03] active:scale-95">
              <Play size={15} /> Run Example
            </button>
            <button onClick={() => { setResult(null); setCode(presets[0].code) }} className="inline-flex items-center gap-1.5 rounded-xl border border-line px-4 py-3 text-sm text-mute transition-colors hover:text-ink">
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <aside className="mt-6 rounded-xl border border-line bg-card p-4" aria-label="Sample data">
            <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-mute">Sample Data</p>
            <div className="space-y-3">
              <MiniTable title="users" rows={USERS} />
              <MiniTable title="orders" rows={ORDERS} />
              <MiniTable title="products" rows={PRODUCTS} />
            </div>
          </aside>
        </section>

        {/* Result side */}
        <section aria-label="Result" aria-live="polite">
          {result ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-2 flex items-center justify-between">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-mute">Result</p>
                <span className="rounded-full bg-sky-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-sky-500 ring-1 ring-sky-500/30">
                  Simulated result · demo data only
                </span>
              </div>
              {result.kind === 'table' ? (
                <ResultTable rows={result.rows} cols={result.cols} />
              ) : (
                <CodeBlock lang="js" title="result.json" code={JSON.stringify(result.docs, null, 2)} lines={false} />
              )}
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-mute">
                <CircleAlert size={12} /> Recognized pattern → matched simulated output at {ranAt?.toLocaleTimeString()}.
              </p>
            </motion.div>
          ) : (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-line p-10 text-center">
              <Play size={26} className="text-mute/50" />
              <p className="mt-3 max-w-xs text-sm text-mute">
                Pick a preset or write your own query, then press <strong className="text-ink">Run Example</strong> to see what the database would return.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function MiniTable({ title, rows }) {
  const cols = Object.keys(rows[0])
  return (
    <div>
      <p className="mb-1 font-mono text-[11px] text-acc">{title}</p>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full whitespace-nowrap text-left font-mono text-[11px]">
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-line/40 last:border-0">
                {cols.map((c) => (
                  <td key={c} className="px-2 py-1.5 text-mute"><span className="mr-1 opacity-60">{c}:</span>{String(r[c])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
