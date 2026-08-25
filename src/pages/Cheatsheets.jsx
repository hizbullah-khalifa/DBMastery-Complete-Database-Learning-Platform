import CheatsheetView, { CheatsheetTabs } from '../components/CheatsheetView.jsx'
import { sqlCheatCategories } from '../data/sqlCommands.js'
import { mongoCheatCategories } from '../data/mongoCommands.js'
import useMeta from '../utils/meta.js'

/** Combined cheatsheets page (navbar "Cheatsheet") with SQL ↔ MongoDB tabs. */
export default function Cheatsheets() {
  useMeta('Cheatsheets', 'SQL and MongoDB side-by-side quick references: every command with syntax, explanation, example and one-click copy.')

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6">
      <header className="mb-8 text-center lg:mb-12">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-acc">Quick References</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-ink sm:text-5xl">
          The <span className="text-gradient">Cheatsheets</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-mute">Two worlds, one bookmark. Toggle between SQL and MongoDB whenever you forget a command.</p>
      </header>
      {/* Render tabs; also expose both views for anchor links */}
      <CheatsheetTabs sqlCats={sqlCheatCategories} mongoCats={mongoCheatCategories} />
    </div>
  )
}

export { CheatsheetView }
