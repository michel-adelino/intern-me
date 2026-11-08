import { Link } from 'react-router-dom'
import { formatEngagement, formatPlace, formatWage } from '../demo/format'
import type { Listing } from '../types'
import { SignMeUpButton } from './SignMeUpButton'

export function OpportunityCard({ listing }: { listing: Listing }) {
  return (
    <article className="flex h-full flex-col rounded-[28px] border border-line bg-card p-5 shadow-[0_16px_40px_rgba(22,20,15,0.05)]">
      <Link to={`/opportunities/${listing.id}`} className="block flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">
          {formatEngagement(listing.kind, listing.duration)}
        </p>
        <h3 className="mt-3 font-serif text-[1.65rem] font-bold leading-tight tracking-tight">{listing.title}</h3>
        <p className="mt-1 text-sm font-medium text-muted">{listing.company}</p>
        <p className="mt-4 text-lg font-bold">{formatWage(listing.wageMin, listing.wageMax)}</p>
        <p className="mt-1 text-sm text-ink-soft">{formatPlace(listing.city, listing.zip, listing.workMode)}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {listing.skills.map((skill) => (
            <li key={skill} className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-ink-soft">
              {skill}
            </li>
          ))}
        </ul>
      </Link>
      <div className="mt-5">
        <SignMeUpButton listingId={listing.id} className="w-full" />
      </div>
    </article>
  )
}
