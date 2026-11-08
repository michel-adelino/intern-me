import { useSearchParams } from 'react-router-dom'
import { cn } from '../demo/cn'
import { parseMode } from '../demo/filter'
import type { WorkFilter } from '../types'

const MODES: { id: WorkFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'remote', label: 'Remote' },
  { id: 'onsite', label: 'On-site' },
]

export function FilterBar() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const mode = parseMode(params.get('mode'))

  const update = (next: { q?: string; mode?: WorkFilter }) => {
    const following = new URLSearchParams(params)
    const q = next.q ?? query
    const nextMode = next.mode ?? mode
    if (q.trim()) following.set('q', q)
    else following.delete('q')
    if (nextMode !== 'all') following.set('mode', nextMode)
    else following.delete('mode')
    setParams(following, { replace: true })
  }

  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-line bg-card p-4 sm:flex-row sm:items-end">
      <label className="block min-w-0 flex-1">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Zip code or area
        </span>
        <input
          value={query}
          onChange={(event) => update({ q: event.target.value })}
          placeholder="10011 or Austin"
          inputMode="text"
          className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus:border-ink"
        />
      </label>
      <div>
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Location
        </span>
        <div className="flex rounded-full bg-paper p-1" role="group" aria-label="Remote or on-site">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={mode === item.id}
              onClick={() => update({ mode: item.id })}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold',
                mode === item.id ? 'bg-ink text-paper' : 'text-ink-soft',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function EmptyMatches({ label }: { label: string }) {
  const [params, setParams] = useSearchParams()
  const query = params.get('q')

  return (
    <div className="rounded-[28px] border border-dashed border-line bg-card px-6 py-16 text-center">
      <p className="font-serif text-2xl font-bold">No {label} in this cut.</p>
      <p className="mx-auto mt-2 max-w-md text-muted">
        {query
          ? `No on-site matches for “${query}”. Remote stays visible on All and Remote.`
          : 'Nothing here for this location type.'}
      </p>
      <button
        type="button"
        onClick={() => setParams(new URLSearchParams(), { replace: true })}
        className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper"
      >
        Reset filters
      </button>
    </div>
  )
}
