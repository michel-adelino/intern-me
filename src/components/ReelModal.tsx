import { useEffect, useRef } from 'react'
import { formatPlace, formatRate } from '../demo/format'
import { useDemo } from '../demo/store'
import type { Listing, Talent } from '../types'
import { SignMeUpButton } from './SignMeUpButton'

function relatedListing(person: Talent, listings: Listing[]): Listing | undefined {
  return (
    listings.find((listing) => listing.skills.some((skill) => person.skills.includes(skill))) ??
    listings.find((listing) => listing.city === person.city) ??
    listings[0]
  )
}

export function ReelModal() {
  const { talent, listings, openTalentId, closeTalent } = useDemo()
  const closeRef = useRef<HTMLButtonElement>(null)
  const person = talent.find((item) => item.id === openTalentId)

  useEffect(() => {
    if (!person) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeTalent()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [person, closeTalent])

  if (!person) return null

  const role = relatedListing(person, listings)

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6" role="presentation">
      <button
        type="button"
        aria-label="Close reel"
        className="absolute inset-0 bg-ink/75"
        onClick={closeTalent}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reel-title"
        className="relative z-10 grid max-h-[100svh] w-full max-w-4xl overflow-y-auto rounded-t-[28px] bg-paper shadow-2xl sm:max-h-[92svh] sm:grid-cols-[minmax(0,320px)_1fr] sm:rounded-[28px]"
      >
        <div className="bg-ink sm:rounded-l-[28px]">
          <video
            key={person.videoUrl}
            className="aspect-[9/16] w-full bg-ink object-cover sm:h-full sm:rounded-l-[28px]"
            src={person.videoUrl}
            poster={person.poster}
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
          />
        </div>
        <div className="relative p-6 sm:p-8">
          <button
            ref={closeRef}
            type="button"
            onClick={closeTalent}
            className="absolute right-4 top-4 rounded-full border border-line px-3 py-1.5 text-sm font-semibold"
          >
            Close
          </button>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">30-second pitch</p>
          <h2 id="reel-title" className="mt-3 font-serif text-4xl font-bold tracking-tight">
            {person.name}
          </h2>
          <p className="mt-1 text-ink-soft">{person.school}</p>
          <p className="mt-4 text-2xl font-bold">{formatRate(person.rate)}</p>
          <p className="mt-1 text-sm text-muted">{formatPlace(person.city, person.zip, person.workMode)}</p>
          {person.creditEligible ? (
            <p className="mt-4 inline-block -rotate-2 border-2 border-ink px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em]">
              Credit eligible
            </p>
          ) : null}
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {person.skills.map((skill) => (
              <li key={skill} className="rounded-full bg-card px-2.5 py-1 text-xs font-medium">
                {skill}
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-ink-soft">{person.blurb}</p>
          <p className="mt-4 text-xs text-muted">Playback stand-in. Production streams the reel through Cloudflare Stream.</p>
          {role ? (
            <div className="mt-6 rounded-[24px] border border-line bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">A role that fits this reel</p>
              <p className="mt-2 font-serif text-xl font-bold">{role.title}</p>
              <p className="text-sm text-muted">{role.company}</p>
              <div className="mt-4">
                <SignMeUpButton listingId={role.id} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
