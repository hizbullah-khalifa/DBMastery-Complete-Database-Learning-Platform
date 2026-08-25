import { NavLink } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useProgress } from '../context/ProgressContext.jsx'

/** Scrollable grouped topic list shared by desktop rail and mobile drawer. */
export default function Sidebar({ topics, categories, base, currentSlug, stack = 'sql' }) {
  const { isDone } = useProgress()
  const activeCls =
    stack === 'mongo'
      ? 'border-green-400 bg-green-400/10 text-green-700 dark:text-green-300'
      : 'border-cyan-400 bg-cyan-400/10 text-cyan-700 dark:text-cyan-300'

  return (
    <nav aria-label={`${stack === 'sql' ? 'SQL' : 'MongoDB'} documentation topics`}>
      {categories.map((cat) => {
        const items = topics.filter((t) => t.category === cat)
        if (!items.length) return null
        const doneCount = items.filter((t) => isDone(t.slug)).length
        return (
          <div key={cat} className="mb-6">
            <p className="mb-1.5 flex items-center gap-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">
              {cat}
              {doneCount > 0 && (
                <span className="rounded-full bg-emerald-500/10 px-1.5 py-px font-mono text-[9px] normal-case text-emerald-500">
                  {doneCount}/{items.length}
                </span>
              )}
            </p>
            <ul className="space-y-px border-l border-line">
              {items.map((t) => (
                <li key={t.slug}>
                  <NavLink
                    to={`${base}/${t.slug}`}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-r-md border-l-2 px-3 py-[7px] text-[13px] leading-snug transition-colors ${
                        isActive
                          ? activeCls + ' font-semibold'
                          : 'border-transparent text-mute hover:border-line hover:bg-soft hover:text-ink'
                      }`
                    }
                  >
                    <span className="flex-1">{t.title}</span>
                    {isDone(t.slug) && <CheckCircle2 size={13} className="shrink-0 text-emerald-500" />}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}
