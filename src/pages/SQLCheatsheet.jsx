import { Link } from 'react-router-dom'
import CheatsheetView, { useCheatVisit } from '../components/CheatsheetView.jsx'
import { sqlCheatCategories } from '../data/sqlCommands.js'
import useMeta from '../utils/meta.js'

export default function SQLCheatsheet() {
  useMeta('SQL Cheatsheet', 'Every essential SQL statement: databases, tables, CRUD, filtering, sorting, aggregation, joins and advanced tools with copy-ready examples.')
  useCheatVisit('sql-cheat')

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <header className="border-b border-line py-10 lg:py-14">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-500">SQL · Quick Reference</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-ink sm:text-5xl">SQL <span className="text-gradient">Cheatsheet</span></h1>
        <p className="mt-3 max-w-2xl text-mute">
          From <code className="font-mono text-acc">CREATE DATABASE</code> to <code className="font-mono text-acc">FULL OUTER JOIN</code> — every command with syntax, explanation and example.
        </p>
        <nav className="mt-5 flex flex-wrap gap-2 text-sm" aria-label="Related pages">
          <Link to="/sql" className="rounded-lg border border-line bg-card px-3.5 py-2 font-medium text-ink transition-colors hover:border-acc/40 hover:text-acc">Full SQL course</Link>
          <Link to="/mongodb/cheatsheet" className="rounded-lg border border-line bg-card px-3.5 py-2 font-medium text-ink transition-colors hover:border-acc/40 hover:text-acc">MongoDB cheatsheet</Link>
        </nav>
      </header>
      <div className="pt-8">
        <CheatsheetView stack="sql" categories={sqlCheatCategories} />
      </div>
    </div>
  )
}
