import { useSearchParams } from 'react-router-dom'
import { EmptyMatches, FilterBar } from '../components/FilterBar'
import { OpportunityCard } from '../components/OpportunityCard'
import { SectionHeading } from '../components/SectionHeading'
import { matchesFilters, parseMode } from '../demo/filter'
import { useDemo } from '../demo/store'

export function OpportunitiesBrowse() {
  const { listings } = useDemo()
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  const mode = parseMode(params.get('mode'))
  const visible = listings.filter((item) => matchesFilters(item, query, mode))

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Open work</p>
      <SectionHeading>Opportunities</SectionHeading>
      <p className="mt-3 max-w-xl text-ink-soft">
        3–12 month internships and 1–8 week projects. SignMeUp sends your reel with one click.
      </p>
      <p className="mt-2 text-sm text-muted" aria-live="polite">
        {visible.length} {visible.length === 1 ? 'role' : 'roles'}
      </p>
      <div className="mt-6">
        <FilterBar />
      </div>
      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyMatches label="roles" />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 min-[720px]:grid-cols-3">
          {visible.map((listing) => (
            <OpportunityCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  )
}
