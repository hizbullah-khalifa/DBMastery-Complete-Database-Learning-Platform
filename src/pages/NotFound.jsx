import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-rose-400">
        Query returned no rows
      </motion.p>
      <motion.h1
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.08 }}
        className="mt-3 font-mono text-7xl font-black text-ink"
      >
        4<span className="text-gradient">0</span>4
      </motion.h1>
      <p className="mt-4 text-lg leading-relaxed text-mute">
        The page you requested doesn’t exist — like a <code className="font-mono text-acc">SELECT</code> against a table that was never created.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-bold text-night-950 shadow-md shadow-emerald-500/20 transition-transform hover:scale-[1.03]">
          <Home size={15} /> Back home
        </Link>
        <Link to="/explorer" className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-acc/40">
          <Compass size={15} /> Command Explorer
        </Link>
      </div>
    </div>
  )
}
