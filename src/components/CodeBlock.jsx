import { useMemo } from 'react'
import { highlightToHtml } from '../utils/highlight.js'
import CopyButton from './CopyButton.jsx'

/**
 * IDE-style code block: dark editor surface in both themes,
 * language badge, filename, line numbers and copy button.
 */
export default function CodeBlock({ lang = 'sql', title, code, lines = true }) {
  const html = useMemo(() => highlightToHtml(code.replace(/\n$/, ''), lang), [code, lang])
  const lineCount = useMemo(() => code.replace(/\n$/, '').split('\n').length, [code])
  const fileHint =
    title || (lang === 'sql' ? 'query.sql' : lang === 'js' ? 'query.js' : lang === 'env' ? '.env' : 'snippet')

  return (
    <figure className="group my-4 overflow-hidden rounded-xl border border-night-700 bg-[#0a1020] shadow-lg shadow-black/20">
      <figcaption className="flex items-center justify-between gap-2 border-b border-white/5 bg-white/[0.03] px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
            {lang === 'js' ? 'MongoDB' : lang === 'env' ? 'ENV' : 'SQL'}
          </span>
          <span className="truncate font-mono text-xs text-slate-500">{fileHint}</span>
        </div>
        <CopyButton text={code} />
      </figcaption>
      <div className="flex overflow-x-auto">
        {lines && (
          <div
            aria-hidden="true"
            className="select-none border-r border-white/5 px-3 py-3 text-right font-mono text-[12.5px] leading-relaxed text-slate-600"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        <pre className="flex-1 px-4 py-3 font-mono text-[12.5px] leading-relaxed text-slate-200">
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>
    </figure>
  )
}
