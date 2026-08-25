import { Link } from 'react-router-dom'
import CheatsheetView, { useCheatVisit } from '../components/CheatsheetView.jsx'
import { mongoCheatCategories } from '../data/mongoCommands.js'
import useMeta from '../utils/meta.js'

export default function MongoCheatsheet() {
  useMeta('MongoDB Cheatsheet', 'Every essential MongoDB shell command: database, collections, CRUD, operators, arrays, aggregation, indexes and transactions with examples.')
  useCheatVisit('mongo-cheat')

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <header className="border-b border-line py-10 lg:py-14">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-green-500">MongoDB · Quick Reference</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-ink sm:text-5xl">MongoDB <span className="text-gradient">Cheatsheet</span></h1>
        <p className="mt-3 max-w-2xl text-mute">
          From <code className="font-mono text-acc">insertOne</code> to <code className="font-mono text-acc">$lookup</code> — the commands you reach for daily, with runnable examples.
        </p>
        <nav className="mt-5 flex flex-wrap gap-2 text-sm" aria-label="Related pages">
          <Link to="/mongodb" className="rounded-lg border border-line bg-card px-3.5 py-2 font-medium text-ink transition-colors hover:border-acc/40 hover:text-acc">Full MongoDB course</Link>
          <Link to="/sql/cheatsheet" className="rounded-lg border border-line bg-card px-3.5 py-2 font-medium text-ink transition-colors hover:border-acc/40 hover:text-acc">SQL cheatsheet</Link>
        </nav>
      </header>
      <div className="pt-8">
        <CheatsheetView stack="mongo" categories={mongoCheatCategories} />
      </div>
    </div>
  )
}
