import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ProgressProvider } from './context/ProgressContext.jsx'
import { SearchProvider } from './context/SearchContext.jsx'
import { sqlTopics, mongoTopics, sqlCheatCategories, mongoCheatCategories } from './data/index.js'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import SearchBar from './components/SearchBar.jsx'

import Home from './pages/Home.jsx'
import SQLDocs from './pages/SQLDocs.jsx'
import SQLTopic from './pages/SQLTopic.jsx'
import SQLCheatsheet from './pages/SQLCheatsheet.jsx'
import MongoDocs from './pages/MongoDocs.jsx'
import MongoTopic from './pages/MongoTopic.jsx'
import MongoCheatsheet from './pages/MongoCheatsheet.jsx'
import Cheatsheets from './pages/Cheatsheets.jsx'
import Explorer from './pages/Explorer.jsx'
import Playground from './pages/Playground.jsx'
import SearchPage from './pages/Search.jsx'
import Compare from './pages/Compare.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'

/** Scrolls to top on navigation (unless a hash anchor is targeted). */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <SearchProvider index={[sqlTopics, mongoTopics, sqlCheatCategories, mongoCheatCategories]}>
          <ScrollManager />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <SearchBar />
            <main className="flex-1" id="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sql" element={<SQLDocs />} />
                <Route path="/sql/cheatsheet" element={<SQLCheatsheet />} />
                <Route path="/sql/:slug" element={<SQLTopic />} />
                <Route path="/mongodb" element={<MongoDocs />} />
                <Route path="/mongodb/cheatsheet" element={<MongoCheatsheet />} />
                <Route path="/mongodb/:slug" element={<MongoTopic />} />
                <Route path="/cheatsheet" element={<Cheatsheets />} />
                <Route path="/cheatsheets" element={<Cheatsheets />} />
                <Route path="/explorer" element={<Explorer />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </SearchProvider>
      </ProgressProvider>
    </ThemeProvider>
  )
}
