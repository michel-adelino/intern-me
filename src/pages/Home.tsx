import { Link, useSearchParams } from 'react-router-dom'
import { EmptyMatches, FilterBar } from '../components/FilterBar'
import { OpportunityCard } from '../components/OpportunityCard'
import { SectionHeading } from '../components/SectionHeading'
import { TalentCard } from '../components/TalentCard'
import { TestimonialCarousel } from '../components/TestimonialCarousel'
import { matchesFilters, parseMode } from '../demo/filter'
import { useDemo } from '../demo/store'

const BEATS = [
  {
    n: '01',
    title: 'Post a reel',
    copy: 'Thirty seconds. A rate between $20 and $28 an hour, the skills, the zip, and a credit-eligible mark if school will count it.',
    to: '/post-reel',
  },
  {
    n: '02',
    title: 'List a project',
    copy: 'Internships from 3–12 months, or a project you can finish in 1–8 weeks. Wage, place, and whether the work is remote.',
    to: '/post-project',
  },
  {
    n: '03',
    title: 'SignMeUp',
    copy: 'One click from a candidate puts the reel on the founder’s list. No second form, no “we’ll be in touch” page.',
    to: '/opportunities',
  },
]

export function Home() {
  const { talent, listings, openTalent } = useDemo()
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  const mode = parseMode(params.get('mode'))
  const search = params.toString()
  const featuredTalent = talent.filter((item) => matchesFilters(item, query, mode)).slice(0, 6)
  const featuredJobs = listings.filter((item) => matchesFilters(item, query, mode)).slice(0, 6)
  const spotlight = talent.slice(0, 3)

  return (
    <>
      <section className="hero-grain relative overflow-hidden bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime">For students and early-stage makers</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Hire from a
              <span className="mt-2 block">
                <span className="bg-lime px-2 text-ink">30-second</span> reel.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/75">
              InternMe is the floor where junior talent pitches once, and founders list the internship or the short project they actually have.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/post-reel" className="rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink">
                Post a Reel
              </Link>
              <Link to="/post-project" className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-paper">
                Post a Job/Project
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {spotlight.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => openTalent(person.id)}
                className="group relative aspect-[9/16] overflow-hidden rounded-[22px] text-left"
              >
                <img
                  src={person.poster}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 motion-safe:group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                <span className="absolute left-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-semibold text-paper">
                  0:30
                </span>
                <span className="absolute inset-x-2 bottom-3 font-serif text-base font-bold leading-tight sm:text-lg">
                  {person.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading>How the floor works</SectionHeading>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {BEATS.map((beat) => (
            <li key={beat.n} className="rounded-[28px] border border-line bg-card p-6">
              <p className="font-serif text-3xl font-bold text-ink">{beat.n}</p>
              <h3 className="mt-4 font-serif text-2xl font-bold">{beat.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{beat.copy}</p>
              <Link to={beat.to} className="mt-5 inline-block text-sm font-bold underline decoration-lime decoration-2 underline-offset-4">
                Open
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8" aria-labelledby="featured-talent">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionHeading id="featured-talent">Featured Talent</SectionHeading>
            <p className="mt-2 text-sm text-muted" aria-live="polite">
              {featuredTalent.length} featured
            </p>
          </div>
          <Link to={search ? `/talent?${search}` : '/talent'} className="text-sm font-bold underline decoration-lime decoration-2 underline-offset-4">
            See all
          </Link>
        </div>
        <div className="mt-6">
          <FilterBar />
        </div>
        {featuredTalent.length === 0 ? (
          <div className="mt-6">
            <EmptyMatches label="talent" />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 min-[720px]:grid-cols-3">
            {featuredTalent.map((person, index) => (
              <TalentCard key={person.id} talent={person} eager={index < 3} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16" aria-labelledby="featured-roles">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionHeading id="featured-roles">Featured Opportunities</SectionHeading>
            <p className="mt-2 text-sm text-muted" aria-live="polite">
              {featuredJobs.length} featured · same zip and location filter
            </p>
          </div>
          <Link
            to={search ? `/opportunities?${search}` : '/opportunities'}
            className="text-sm font-bold underline decoration-lime decoration-2 underline-offset-4"
          >
            See all
          </Link>
        </div>
        <div className="mt-6">
          <FilterBar />
        </div>
        {featuredJobs.length === 0 ? (
          <div className="mt-6">
            <EmptyMatches label="roles" />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 min-[720px]:grid-cols-3">
            {featuredJobs.map((listing) => (
              <OpportunityCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      <TestimonialCarousel />
    </>
  )
}
