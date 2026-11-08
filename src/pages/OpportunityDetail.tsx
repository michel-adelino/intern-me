import { Link, useParams } from 'react-router-dom'
import { SectionHeading } from '../components/SectionHeading'
import { SignMeUpButton } from '../components/SignMeUpButton'
import { formatEngagement, formatPlace, formatWage } from '../demo/format'
import { useDemo } from '../demo/store'

export function OpportunityDetail() {
  const { id } = useParams()
  const { listings, applications } = useDemo()
  const listing = listings.find((item) => item.id === id)

  if (!listing) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-20">
        <SectionHeading>That role has left the floor.</SectionHeading>
        <Link to="/opportunities" className="mt-6 inline-block font-bold underline decoration-lime decoration-2 underline-offset-4">
          Back to opportunities
        </Link>
      </section>
    )
  }

  const signed = applications.filter((item) => item.listingId === listing.id).length

  return (
    <article className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.4fr_0.7fr]">
      <div>
        <Link to="/opportunities" className="text-sm font-bold text-muted">
          ← Opportunities
        </Link>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">
          {formatEngagement(listing.kind, listing.duration)}
        </p>
        <h1 className="mt-3 font-serif text-5xl font-bold tracking-tight">{listing.title}</h1>
        <p className="mt-2 text-lg text-ink-soft">{listing.company}</p>
        <p className="mt-8 max-w-prose text-lg leading-relaxed">{listing.summary}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {listing.skills.map((skill) => (
            <li key={skill} className="rounded-full bg-card px-3 py-1.5 text-sm font-medium">
              {skill}
            </li>
          ))}
        </ul>
      </div>
      <aside className="h-fit rounded-[28px] border border-line bg-card p-6 lg:sticky lg:top-24">
        <p className="text-3xl font-bold">{formatWage(listing.wageMin, listing.wageMax)}</p>
        <p className="mt-2 text-sm text-ink-soft">{formatPlace(listing.city, listing.zip, listing.workMode)}</p>
        <p className="mt-2 text-sm text-muted">
          {signed} {signed === 1 ? 'person has' : 'people have'} signed up
        </p>
        <div className="mt-6">
          <SignMeUpButton listingId={listing.id} className="w-full" />
        </div>
      </aside>
    </article>
  )
}
