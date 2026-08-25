import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/** Bottom-of-lesson previous/next navigation following the learning sequence. */
export default function PrevNextNav({ prev, next, base }) {
  return (
    <div className="mt-14 grid gap-3 sm:grid-cols-2" role="navigation" aria-label="Lesson pagination">
      {prev ? (
        <Link
          to={`${base}/${prev.slug}`}
          className="group flex items-center gap-3 rounded-xl border border-line bg-card p-4 transition-all hover:border-acc/40 hover:shadow-md"
        >
          <ChevronLeft size={18} className="shrink-0 text-mute transition-transform group-hover:-translate-x-1 group-hover:text-acc" />
          <span>
            <span className="block text-[11px] uppercase tracking-wider text-mute">← Previous</span>
            <span className="mt-0.5 block text-sm font-semibold text-ink group-hover:text-acc">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          to={`${base}/${next.slug}`}
          className="group flex items-center justify-end gap-3 rounded-xl border border-line bg-card p-4 text-right transition-all hover:border-acc/40 hover:shadow-md"
        >
          <span>
            <span className="block text-[11px] uppercase tracking-wider text-mute">Next →</span>
            <span className="mt-0.5 block text-sm font-semibold text-ink group-hover:text-acc">{next.title}</span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-mute transition-transform group-hover:translate-x-1 group-hover:text-acc" />
        </Link>
      )}
    </div>
  )
}
