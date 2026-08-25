import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="relative flex h-9 w-[64px] items-center rounded-full border border-line bg-soft transition-colors duration-300 hover:border-acc/50"
    >
      {/* sliding knob */}
      <motion.span
        initial={false}
        animate={{ x: isDark ? 4 : 32 }}
        transition={{ type: 'spring', stiffness: 500, damping: 34 }}
        className={`absolute top-1/2 z-10 -mt-[14px] flex h-7 w-7 items-center justify-center rounded-full shadow-md ${
          isDark
            ? 'bg-gradient-to-br from-indigo-500 to-night-700 text-slate-100'
            : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon size={14} />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun size={15} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>

      {/* track icons */}
      <span className="pointer-events-none flex w-full items-center justify-between px-[9px]">
        <Sun size={12} className={`text-mute transition-opacity duration-300 ${isDark ? 'opacity-40' : 'opacity-0'}`} />
        <Moon size={12} className={`text-mute transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-40'}`} />
      </span>
    </button>
  )
}
