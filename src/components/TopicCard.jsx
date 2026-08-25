import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export const diffColor = {
  Beginner: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Intermediate: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  Advanced: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
}

/**
 * Card used for lesson grids on the docs overview pages.
 */
export default function TopicCard({ topic, base, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: (index % 6) * 0.05 }}
    >
      <Link
        to={`${base}/${topic.slug}`}
        className="group flex h-full flex-col rounded-xl border border-line bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-acc/40 hover:shadow-lg hover:shadow-emerald-500/5 focus-visible:-translate-y-1"
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-soft px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-mute">
            {topic.category}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${diffColor[topic.diff]}`}>
            {topic.diff}
          </span>
        </div>
        <h3 className="font-semibold leading-snug text-ink transition-colors group-hover:text-acc">
          {topic.title}
        </h3>
        <p className="mt-1.5 line-clamp-3 flex-1 text-sm leading-relaxed text-mute">{topic.desc}</p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <span className="font-mono text-[11px] text-mute">{topic.minutes} min read</span>
          <ArrowRight size={15} className="text-mute transition-all duration-200 group-hover:translate-x-1 group-hover:text-acc" />
        </div>
      </Link>
    </motion.div>
  )
}
