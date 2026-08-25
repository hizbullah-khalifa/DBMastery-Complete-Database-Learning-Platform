import { Fragment } from 'react'
import { AlertTriangle, Info, Lightbulb } from 'lucide-react'
import CodeBlock from './CodeBlock.jsx'

/** Parse tiny inline markup: `code` spans and **bold**. */
export function Inline({ text }) {
  const parts = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
          return (
            <code key={i} className="rounded-md border border-line bg-soft px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-acc">
              {part.slice(1, -1)}
            </code>
          )
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
          return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}

const NOTE_STYLES = {
  info: { icon: Info, cls: 'border-sky-500/30 bg-sky-500/[0.07]', iconCls: 'text-sky-500', label: 'Note' },
  tip: { icon: Lightbulb, cls: 'border-emerald-500/30 bg-emerald-500/[0.07]', iconCls: 'text-emerald-500', label: 'Quick Tip' },
  warn: { icon: AlertTriangle, cls: 'border-rose-500/30 bg-rose-500/[0.07]', iconCls: 'text-rose-500', label: 'Warning' },
}

function Block({ b }) {
  switch (b.t) {
    case 'p':
      return <p className="my-3 text-[15px] leading-7 text-mute"><Inline text={b.x} /></p>
    case 'h3':
      return <h3 className="mt-6 mb-2 text-lg font-bold text-ink">{b.x}</h3>
    case 'code':
      return <CodeBlock lang={b.lang} title={b.title} code={b.src} />
    case 'ul':
      return (
        <ul className="my-3 space-y-2 pl-1">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] leading-7 text-mute">
              <span aria-hidden className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
              <span><Inline text={it} /></span>
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol className="my-3 space-y-2">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-7 text-mute">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-soft font-mono text-[11px] font-bold text-acc ring-1 ring-line">{i + 1}</span>
              <span><Inline text={it} /></span>
            </li>
          ))}
        </ol>
      )
    case 'table':
      return (
        <div className="my-4 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="bg-soft">
                {b.head.map((h, i) => (
                  <th key={i} scope="col" className="border-b border-line px-4 py-2.5 text-left font-semibold text-ink">
                    <Inline text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, i) => (
                <tr key={i} className={i % 2 ? 'bg-soft/40' : ''}>
                  {row.map((cell, j) => (
                    <td key={j} className="border-b border-line/60 px-4 py-2.5 align-top text-mute">
                      <Inline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'note': {
      const s = NOTE_STYLES[b.kind] || NOTE_STYLES.info
      const Icon = s.icon
      return (
        <aside className={`my-4 flex gap-3 rounded-xl border px-4 py-3 ${s.cls}`} role={b.kind === 'warn' ? 'alert' : undefined}>
          <Icon size={17} className={`mt-0.5 shrink-0 ${s.iconCls}`} aria-hidden />
          <p className="text-sm leading-relaxed text-mute">
            <strong className={`mr-1.5 font-semibold ${s.iconCls}`}>{s.label}</strong>
            <Inline text={b.x} />
          </p>
        </aside>
      )
    }
    case 'lines':
      return (
        <div className="my-4 overflow-hidden rounded-xl border border-line">
          <p className="border-b border-line bg-soft px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">Line by line</p>
          <dl className="divide-y divide-line/60">
            {b.rows.map((r, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2">
                <dt className="px-4 pt-3 sm:border-r border-line/60 sm:py-3">
                  <code className="break-all rounded bg-soft px-1.5 py-0.5 font-mono text-[12px] font-semibold text-acc">{r.c}</code>
                </dt>
                <dd className="px-4 pb-3 pt-1 text-[13.5px] leading-relaxed text-mute sm:py-3">{r.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      )
    case 'dia':
      return (
        <pre className="code-surface my-4 overflow-x-auto rounded-xl border border-night-700 p-4 font-mono text-[12.5px] leading-relaxed text-slate-300" aria-label="Diagram">
          {b.src}
        </pre>
      )
    default:
      return null
  }
}

export default function Blocks({ blocks }) {
  return blocks.map((b, i) => <Block key={i} b={b} />)
}
