// Dev-only sanity script: verifies lucide icon names + data shape.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else if (/\.(jsx|js)$/.test(f)) out.push(p)
  }
  return out
}

const files = walk(join(ROOT, '..', 'src'))
const names = new Set()
for (const f of files) {
  const src = readFileSync(f, 'utf8')
  const m = src.match(/import\s*\{([^}]+)\}\s*from\s*'lucide-react'/gs)
  if (m) {
    for (const group of m) {
      const inner = group.match(/\{([^}]+)\}/s)[1]
      inner.split(',').forEach((n) => n.trim() && names.add(n.trim()))
    }
  }
}

const dts = readFileSync('./node_modules/lucide-react/dist/lucide-react.d.ts', 'utf8')
const missing = [...names].filter((n) => !new RegExp(`\\b${n}\\b`).test(dts))
console.log(`icons used: ${names.size}`)
console.log(missing.length ? `MISSING ICONS: ${missing.join(', ')}` : 'all icons valid')

// Validate lesson + cheatsheet data shape
const { sqlTopics, mongoTopics, allCommands } = await import('../src/data/index.js')
let bad = 0
for (const t of [...sqlTopics, ...mongoTopics]) {
  const issues = []
  if (!t.slug || !t.title || !t.category || !t.diff || !t.desc) issues.push('meta')
  if (!Array.isArray(t.sections) || t.sections.length === 0) issues.push('sections empty')
  else
    for (const s of t.sections) {
      if (!s.id || !s.heading || !Array.isArray(s.blocks)) issues.push(`section ${s?.heading}`)
      for (const b of s.blocks || []) {
        if (!b.t) issues.push(`block without t in ${s.heading}`)
        if (b.t === 'code' && typeof b.src !== 'string') issues.push(`code block in ${s.heading}`)
        if (b.t === 'lines' && !Array.isArray(b.rows)) issues.push(`lines in ${s.heading}`)
      }
    }
  if (t.challenge && (!t.challenge.accept?.length || !t.challenge.solution)) issues.push('challenge')
  if (issues.length) { console.log(`BAD ${t.slug}: ${issues.join('; ')}`); bad++ }
}
console.log(`${sqlTopics.length} SQL topics, ${mongoTopics.length} MongoDB topics`)
console.log(bad ? `${bad} topics with problems` : 'all topics structurally valid')

for (const c of allCommands()) {
  if (!c.cmd || !c.syntax || !c.desc || !c.example || !c.diff || !c.category)
    { console.log('BAD command:', JSON.stringify(c)); break }
}
console.log('commands validated:', allCommands().length)
