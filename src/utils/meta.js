import { useEffect } from 'react'

/** Sets the document title + meta description per page (lightweight SEO). */
export default function useMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — DBMastery` : 'DBMastery — Master SQL & MongoDB'
    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }
  }, [title, description])
}

/** Normalize a user's answer so challenge checking is forgiving. */
export function normalizeAnswer(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/--[^\n]*/g, '')
    .replace(/\/\/[^\n]*/g, '')
    .replace(/["'`]/g, "'")
    .replace(/\s+/g, '')
    .replace(/;+$/, '')
}
