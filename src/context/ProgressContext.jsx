import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { sqlTopics, mongoTopics } from '../data/index.js'

const KEY = 'dbmastery-progress'

const ProgressContext = createContext(null)

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

export function ProgressProvider({ children }) {
  const [data, setData] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data))
    } catch {}
  }, [data])

  const toggleDone = useCallback((slug) => {
    setData((d) => ({ ...d, [slug]: !d[slug] }))
  }, [])

  const recordVisit = useCallback((kind) => {
    setData((d) => ({ ...d, [`visits:${kind}`]: (d[`visits:${kind}`] || 0) + 1 }))
  }, [])

  const setLast = useCallback((label) => {
    setData((d) => ({ ...d, lastTopic: label }))
  }, [])

  const value = useMemo(() => {
    const doneCount = (topics) => topics.filter((t) => data[t.slug]).length
    const pct = (n, total) => (total ? Math.round((n / total) * 100) : 0)
    const sqlDone = doneCount(sqlTopics)
    const mongoDone = doneCount(mongoTopics)
    return {
      data,
      isDone: (slug) => !!data[slug],
      toggleDone,
      recordVisit,
      setLast,
      sqlDone,
      mongoDone,
      sqlPct: pct(sqlDone, sqlTopics.length),
      mongoPct: pct(mongoDone, mongoTopics.length),
      totalDone: sqlDone + mongoDone,
      totalLessons: sqlTopics.length + mongoTopics.length,
      visitsSql: data['visits:sql-cheat'] || 0,
      visitsMongo: data['visits:mongo-cheat'] || 0,
      lastTopic: data.lastTopic || null,
    }
  }, [data, toggleDone, recordVisit, setLast])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  return useContext(ProgressContext)
}
