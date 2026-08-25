import { sqlTopicsA } from './sqlTopics.js'
import { sqlTopicsB } from './sqlTopics2.js'
import { mongoTopicsA } from './mongoTopics.js'
import { mongoTopicsB } from './mongoTopics2.js'
import { sqlCheatCategories } from './sqlCommands.js'
import { mongoCheatCategories } from './mongoCommands.js'

export const sqlTopics = [...sqlTopicsA, ...sqlTopicsB]
export const mongoTopics = [...mongoTopicsA, ...mongoTopicsB]
export { sqlCheatCategories, mongoCheatCategories }

const byStack = {
  sql: sqlTopics,
  mongo: mongoTopics,
}
const baseByStack = {
  sql: '/sql',
  mongo: '/mongodb',
}

export function topicsFor(stack) {
  return byStack[stack]
}

/** Find topic + its neighbours following the learning sequence. */
export function locateTopic(stack, slug) {
  const list = byStack[stack]
  const i = list.findIndex((t) => t.slug === slug)
  if (i === -1) return null
  return {
    topic: list[i],
    prev: i > 0 ? list[i - 1] : null,
    next: i < list.length - 1 ? list[i + 1] : null,
    base: baseByStack[stack],
    stack,
  }
}

/** Unified command list for the Explorer. */
export function allCommands() {
  const out = []
  for (const cat of sqlCheatCategories)
    for (const c of cat.commands)
      out.push({ ...c, stack: 'sql', category: cat.name })
  for (const cat of mongoCheatCategories)
    for (const c of cat.commands)
      out.push({ ...c, stack: 'mongo', category: cat.name })
  return out
}

export const stackMeta = {
  sql: {
    label: 'SQL',
    base: '/sql',
    cheatPath: '/sql/cheatsheet',
    icon: 'sql',
  },
  mongo: {
    label: 'MongoDB',
    base: '/mongodb',
    cheatPath: '/mongodb/cheatsheet',
    icon: 'mongo',
  },
}
