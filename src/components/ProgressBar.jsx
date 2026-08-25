import { motion } from 'framer-motion'

/**
 * Animated progress bar.
 * stack: 'sql' (emerald→cyan) or 'mongo' (green) or default accent.
 */
export default function ProgressBar({ value = 0, stack = 'sql', label, showPercent = true, height = 'h-2.5' }) {
  const gradient =
    stack === 'mongo'
      ? 'from-green-500 to-emerald-300'
      : 'from-emerald-500 to-cyan-400'

  return (
    <div>
      {(label || showPercent) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          {label && <span className="text-sm font-medium text-ink">{label}</span>}
          {showPercent && (
            <motion.span
              key={value}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-xs font-semibold text-acc"
            >
              {value}%
            </motion.span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
        className={`w-full overflow-hidden rounded-full bg-soft ring-1 ring-line ${height}`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
        />
      </div>
    </div>
  )
}
