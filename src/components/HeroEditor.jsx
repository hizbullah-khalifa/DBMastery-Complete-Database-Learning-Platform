import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { highlightToHtml } from '../utils/highlight.js'
import CopyButton from './CopyButton.jsx'

const CODE = `SELECT
    users.name,
    COUNT(orders.id) AS total_orders
FROM users
LEFT JOIN orders
    ON users.id = orders.user_id
WHERE users.status = 'active'
GROUP BY users.name
ORDER BY total_orders DESC;`

/** Mac-style animated code editor for the hero section. */
export default function HeroEditor() {
  const reduceMotion = useReducedMotion()
  const [typed, setTyped] = useState(reduceMotion ? CODE.length : 0)
  const timer = useRef(null)

  useEffect(() => {
    if (reduceMotion) return
    timer.current = setInterval(() => {
      setTyped((n) => {
        if (n >= CODE.length) {
          clearInterval(timer.current)
          return n
        }
        return n + 2
      })
    }, 16)
    return () => clearInterval(timer.current)
  }, [reduceMotion])

  const shown = CODE.slice(0, typed)
  const html = useMemo(() => highlightToHtml(shown, 'sql'), [shown])
  const done = typed >= CODE.length

  return (
    <div className="glow-soft relative">
      {/* glow accent */}
      <div aria-hidden className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-transparent to-cyan-500/15 blur-2xl" />

      <figure className="relative overflow-hidden rounded-2xl border border-night-700 bg-[#0a1020] shadow-2xl shadow-black/40 ring-1 ring-white/5" aria-label="Animated SQL code example">
        {/* Mac-style header */}
        <figcaption className="flex items-center gap-3 border-b border-white/5 bg-white/[0.03] px-4 py-3">
          <span className="flex gap-1.5" aria-hidden>
            <i className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <i className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <i className="h-3 w-3 rounded-full bg-[#28c840]" />
          </span>
          <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-slate-400">database.sql</span>
          <span className="ml-auto"><CopyButton text={CODE} /></span>
        </figcaption>

        <div className="flex overflow-x-auto px-1 py-1">
          {/* line numbers */}
          <div aria-hidden className="select-none px-3 pt-2 text-right font-mono text-[12.5px] leading-relaxed text-slate-600">
            {CODE.split('\n').map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          {/* code */}
          <pre className="min-h-[248px] flex-1 px-3 pt-2 pb-4 font-mono text-[12.5px] leading-relaxed text-slate-200 sm:text-[13px]">
            <code dangerouslySetInnerHTML={{ __html: html }} />
            {!done && (
              <span className="ml-0.5 inline-block h-[15px] w-[7px] translate-y-[2px] animate-pulse rounded-[2px] bg-emerald-400" aria-hidden />
            )}
            {done && (
              <span className="ml-1 inline-block h-[15px] w-[7px] translate-y-[2px] animate-pulse rounded-[2px] bg-emerald-400/70" aria-hidden />
            )}
          </pre>
        </div>
      </figure>

      <p className="mt-4 text-center font-mono text-xs tracking-wide text-mute sm:text-right">
        Real queries. Clear explanations. Practical learning.
      </p>
    </div>
  )
}
