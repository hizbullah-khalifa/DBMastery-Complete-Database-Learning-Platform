import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

/** Clickable breadcrumb trail: Home / SQL / Category / Lesson */
export default function Breadcrumbs({ trail }) {
  // trail: [{label, to?}, ...]
  const [isDesktop, setIsDesktop] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const fn = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 font-mono text-[12px] text-mute">
        {trail.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={12} className="opacity-50" />}
            {item.to ? (
              <Link to={item.to} className="rounded transition-colors hover:text-acc hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-ink">
                {isDesktop || trail.length <= 3 ? item.label : item.label.split(' ').slice(-1)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
