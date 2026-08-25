import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Database, Github, Menu, Search, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'
import { useSearch } from '../context/SearchContext'

const LINKS = [
  { to: '/#learning-paths', label: 'Learn' },
  { to: '/sql', label: 'SQL', accent: true },
  { to: '/mongodb', label: 'MongoDB', accent: true },
  { to: '/cheatsheets', label: 'Cheatsheet' },
  { to: '/explorer', label: 'Explorer' },
  { to: '/about', label: 'About' },
]

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="DBMastery home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-night-950 shadow-lg shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-105">
        <Database size={17} strokeWidth={2.5} />
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-md bg-card font-mono text-[9px] font-bold text-acc ring-1 ring-line">{'</>'}</span>
      </span>
      <span className="leading-none">
        <span className="block text-[15px] font-extrabold tracking-tight text-ink">
          DB<span className="text-gradient">Mastery</span>
        </span>
        <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.18em] text-mute">learn · query · build</span>
      </span>
    </Link>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { setOpen } = useSearch()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    className={`sticky top-0 z-50 border-b transition-all duration-300 ${
  scrolled && !mobileOpen
    ? 'border-line bg-base/85 shadow-lg shadow-black/[0.04] backdrop-blur-xl'
    : 'border-transparent bg-transparent'
}`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6" aria-label="Main navigation">
        <Logo />

        {/* desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) =>
            l.to.includes('#') ? (
              <a key={l.label} href={l.to} className="rounded-lg px-3 py-2 text-sm font-medium text-mute transition-colors hover:bg-soft hover:text-ink">
                {l.label}
              </a>
            ) : (
              <NavLink
                key={l.label}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? (l.accent ? 'text-emerald-400' : 'text-acc') : 'text-mute hover:bg-soft hover:text-ink'
                  }`
                }
              >
                {l.label}
              </NavLink>
            )
          )}
        </div>

        {/* right cluster */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open search"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-card text-mute transition-colors hover:text-ink md:hidden"
          >
            <Search size={16} />
          </button>
          <div className="hidden md:block">
            <NavbarSearchTrigger />
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="DBMastery on GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-line bg-card text-mute transition-colors hover:border-acc/50 hover:text-ink sm:flex"
          >
            <Github size={16} />
          </a>
          <ThemeToggle />
          <Link
            to="/sql/introduction"
            className="hidden items-center rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-night-950 shadow-md shadow-emerald-500/20 transition-transform duration-200 hover:scale-[1.03] active:scale-95 md:inline-flex"
          >
            Start Learning
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-card text-ink lg:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={() => setMobileOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-night-950/60 backdrop-blur-sm lg:hidden"
            />
                        <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative z-50 overflow-hidden border-b border-line bg-card isolate backdrop-blur-none lg:hidden"
            >
              <div className="space-y-1 px-4 py-4">
                {LINKS.map((l, i) => (
                  <motion.div
                    key={l.label}
                    initial={{ x: -14, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <NavLink
                      to={l.to}
                      end={!l.to.includes('#')}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2.5 text-[15px] font-medium ${
                          isActive ? 'bg-soft text-acc' : 'text-mute hover:bg-soft hover:text-ink'
                        }`
                      }
                    >
                      {l.label}
                    </NavLink>
                  </motion.div>
                ))}
                <div className="flex gap-2 pt-3">
                  <Link
                    to="/sql/introduction"
                    className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-center text-sm font-semibold text-night-950"
                  >
                    Start Learning
                  </Link>
                  <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="flex h-full min-h-[42px] w-11 items-center justify-center rounded-lg border border-line text-mute">
                    <Github size={17} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

/** Small wrapper so the desktop search pill lives inside Navbar file cleanly. */
function NavbarSearchTrigger() {
  const { setOpen } = useSearch()
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-2 text-sm text-mute transition-colors hover:border-acc/50 hover:text-ink"
      aria-label="Search documentation (Ctrl+K)"
    >
      <Search size={15} className="text-acc" />
      <span className="hidden xl:inline">Search docs…</span>
      <kbd className="ml-2 hidden rounded border border-line bg-soft px-1.5 py-0.5 font-mono text-[10px] xl:inline">Ctrl K</kbd>
    </button>
  )
}