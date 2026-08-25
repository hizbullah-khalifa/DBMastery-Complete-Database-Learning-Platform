import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import CommandExplorer from '../components/CommandExplorer.jsx'
import useMeta from '../utils/meta.js'

export default function Explorer() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const stack = (params.get('stack') || 'All')

  useMeta('Command Explorer', 'Search every SQL and MongoDB command with syntax, examples, difficulty and related commands — all in one place.')

  // Scroll modal-less page to top on load
  useEffect(() => window.scrollTo(0, 0), [])

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6">
      <header className="mb-8 text-center lg:mb-12">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-acc">Interactive Reference</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-ink sm:text-5xl">
          Command <span className="text-gradient">Explorer</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-mute">
          Every SQL and MongoDB command on this site — searchable, filterable, copyable. Click any card for syntax, examples and related commands.
        </p>
      </header>
      <CommandExplorer initialQuery={q} initialStack={stack === 'sql' ? 'SQL' : stack === 'mongo' ? 'MongoDB' : 'All'} />
    </div>
  )
}
