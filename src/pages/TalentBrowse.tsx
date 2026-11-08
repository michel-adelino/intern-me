import { useSearchParams } from 'react-router-dom'
import { EmptyMatches, FilterBar } from '../components/FilterBar'
import { SectionHeading } from '../components/SectionHeading'
import { TalentCard } from '../components/TalentCard'
import { matchesFilters, parseMode } from '../demo/filter'
import { useDemo } from '../demo/store'

export function TalentBrowse() {
  const { talent } = useDemo()
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  const mode = parseMode(params.get('mode'))
  const visible = talent.filter((item) => matchesFilters(item, query, mode))

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">The floor</p>
      <SectionHeading>Talent</SectionHeading>
      <p className="mt-3 max-w-xl text-ink-soft">
        Every reel is a thirty-second pitch. Home keeps the curation at six. Here you can see the full cut.
      </p>
      <p className="mt-2 text-sm text-muted" aria-live="polite">
        {visible.length} {visible.length === 1 ? 'reel' : 'reels'}
      </p>
      <div className="mt-6">
        <FilterBar />
      </div>
      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyMatches label="talent" />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 min-[720px]:grid-cols-3">
          {visible.map((person) => (
            <TalentCard key={person.id} talent={person} />
          ))}
        </div>
      )}
    </section>
  )
}
