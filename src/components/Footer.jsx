import { Link } from 'react-router-dom'
import { ArrowUpRight, Database } from 'lucide-react'

const COLS = [
  {
    title: 'Learn',
    links: [
      { label: 'SQL Documentation', to: '/sql' },
      { label: 'MongoDB Documentation', to: '/mongodb' },
      { label: 'Cheatsheets', to: '/cheatsheets' },
      { label: 'Command Explorer', to: '/explorer' },
      { label: 'Playground', to: '/playground' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'SQL vs MongoDB', to: '/compare' },
      { label: 'Search', to: '/search?q=joins' },
      { label: 'Practice Challenges', to: '/sql/joins' },
      { label: 'About', to: '/about' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub', href: 'https://github.com' },
      { label: 'Contribute', href: 'https://github.com' },
      { label: 'Feedback', href: 'mailto:hello@dbmastery.dev' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-card/50" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-night-950">
                <Database size={17} strokeWidth={2.5} />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-ink">
                DB<span className="text-gradient">Mastery</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mute">
              Master SQL & MongoDB with practical, developer-focused documentation — clear explanations, real commands and hands-on challenges.
            </p>
            <p className="mt-4 inline-flex items-center rounded-full border border-line bg-soft px-3 py-1 font-mono text-[11px] text-mute">
              No signup · Progress saved locally
            </p>
          </div>

          {COLS.map((col) => (
            <nav key={col.title} aria-label={`Footer: ${col.title}`}>
              <h3 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) =>
                  l.to ? (
                    <li key={l.label}>
                      <Link to={l.to} className="group inline-flex items-center gap-1 text-sm text-mute transition-colors hover:text-acc">
                        {l.label}
                        <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <a href={l.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-sm text-mute transition-colors hover:text-acc">
                        {l.label}
                        <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </li>
                  )
                )}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row">
          <p className="text-center text-xs text-mute sm:text-left">
            Built for developers who want to <span className="font-semibold text-ink">understand databases</span>, not just memorize commands.
          </p>
          <p className="font-mono text-[11px] text-mute">© {new Date().getFullYear()} DBMastery</p>
        </div>
      </div>
    </footer>
  )
}
