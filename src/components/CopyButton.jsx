import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'

function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text)
  }
  // Fallback for non-secure contexts
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
      resolve()
    } catch (e) {
      reject(e)
    } finally {
      document.body.removeChild(ta)
    }
  })
}

export default function CopyButton({ text, label = false }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  const onCopy = async () => {
    try {
      await copyToClipboard(text)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] transition-colors duration-150 focus-visible:outline-2 ${
        copied
          ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
          : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/25 hover:text-slate-200'
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1"
          >
            <Check size={13} strokeWidth={2.5} /> {label ? 'Copied!' : ''}
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1"
          >
            <Copy size={13} /> {label ? 'Copy' : ''}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
