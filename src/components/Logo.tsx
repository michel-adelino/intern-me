import { Link } from 'react-router-dom'

export function Logo({ tone = 'light', onClick }: { tone?: 'light' | 'dark'; onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 ${tone === 'light' ? 'text-paper' : 'text-ink'}`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime text-ink" aria-hidden="true">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
          <path d="M5 3.2 13 8 5 12.8V3.2z" />
        </svg>
      </span>
      <span className="font-serif text-xl font-bold tracking-tight">InternMe</span>
    </Link>
  )
}
