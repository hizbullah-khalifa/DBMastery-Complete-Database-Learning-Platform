import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, Lightbulb, PartyPopper, RotateCcw, XCircle } from 'lucide-react'
import { normalizeAnswer } from '../utils/meta.js'

/** Interactive practice challenge attached to a lesson. */
export default function ChallengeBox({ challenge }) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('idle') // idle | correct | wrong
  const [showSolution, setShowSolution] = useState(false)

  const check = () => {
    const attempt = normalizeAnswer(value)
    const ok = challenge.accept.some((a) => normalizeAnswer(a) === attempt)
    setStatus(ok ? 'correct' : 'wrong')
  }

  return (
    <section
      aria-label="Practice challenge"
      className="my-8 overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.06] to-transparent"
    >
      <header className="flex items-center gap-2 border-b border-amber-500/20 bg-amber-500/10 px-4 py-2.5">
        <Lightbulb size={15} className="text-amber-500" />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
          Practice Challenge
        </span>
        {status === 'idle' && (
          <span className="ml-auto rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] text-amber-600 dark:text-amber-400">
            try it yourself
          </span>
        )}
      </header>

      <div className="p-4 sm:p-5">
        <p className="text-[15px] font-medium leading-relaxed text-ink">{challenge.q}</p>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="challenge-input">Your answer</label>
          <textarea
            id="challenge-input"
            value={value}
            rows={2}
            spellCheck={false}
            onChange={(e) => {
              setValue(e.target.value)
              if (status !== 'idle') setStatus('idle')
            }}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), check())}
            placeholder="Write your query here…"
            className="min-h-[52px] flex-1 resize-y rounded-lg border border-line bg-base px-3 py-2.5 font-mono text-[13px] text-ink outline-none transition-colors placeholder:text-mute/50 focus:border-acc"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={check}
              disabled={!value.trim()}
              className="h-fit rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-night-950 shadow-sm transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Check Answer
            </button>
            {(status === 'wrong' || showSolution) && (
              <button
                type="button"
                onClick={() => setShowSolution((s) => !s)}
                className="h-fit rounded-lg border border-line px-3 py-2.5 text-sm text-mute transition-colors hover:text-ink"
              >
                {showSolution ? 'Hide' : 'Solution'}
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {status === 'correct' && (
            <motion.p
              key="ok"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
            >
              <PartyPopper size={16} /> Correct! 🎉 Nicely done — concept mastered.
            </motion.p>
          )}
          {status === 'wrong' && (
            <motion.div
              key="no"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3"
            >
              <p className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400">
                <XCircle size={16} /> Try Again — compare your syntax with the hint below.
              </p>
              <p className="mt-1.5 pl-1 text-xs text-mute">Hint: {challenge.hint}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {showSolution && (
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 overflow-x-auto rounded-lg border border-line bg-base p-3 font-mono text-[12.5px] text-ink"
          >
            {challenge.solution}
          </motion.pre>
        )}

        {status === 'correct' && (
          <button
            type="button"
            onClick={() => { setValue(''); setStatus('idle'); setShowSolution(false) }}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-mute transition-colors hover:text-acc"
          >
            <RotateCcw size={12} /> Reset & practice once more
          </button>
        )}
        {status === 'idle' && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-mute">
            <Eye size={12} /> Whitespace and case don’t matter — focus on structure.
          </p>
        )}
      </div>
    </section>
  )
}
