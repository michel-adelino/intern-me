import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/SectionHeading'

const PLANS = [
  {
    who: 'Talent',
    price: '$0',
    note: 'Free to pitch',
    points: [
      'One 30-second reel on the floor',
      'Rate shown between $20 and $28/hr',
      'Credit eligible badge when school will count the work',
      'SignMeUp on internships and short projects',
    ],
    to: '/post-reel',
    cta: 'Post a Reel',
  },
  {
    who: 'Founders',
    price: '$0',
    note: 'Free during the beta',
    points: [
      'Internships of 3–12 months and projects of 1–8 weeks',
      'Zip code, city, and remote or on-site',
      'Watch the reel before you write anyone back',
      'Six featured slots a side, chosen so the floor stays readable',
    ],
    to: '/post-project',
    cta: 'Post a Job/Project',
  },
]

export function Pricing() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Beta</p>
      <SectionHeading>Pricing while the floor is curated</SectionHeading>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        Talent posts for free. Founder listings are free while InternMe is in beta. The thing you pay for later is a featured slot, and even then the grid never grows past six.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {PLANS.map((plan) => (
          <article key={plan.who} className="flex flex-col rounded-[28px] border border-line bg-card p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{plan.who}</p>
            <p className="mt-4 font-serif text-6xl font-bold tracking-tight">{plan.price}</p>
            <p className="mt-2 text-sm font-semibold text-ink-soft">{plan.note}</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm leading-relaxed">
              {plan.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-lime" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Link to={plan.to} className="mt-8 inline-flex justify-center rounded-full bg-ink px-5 py-3 text-sm font-bold text-paper">
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>
      <p className="mt-8 max-w-2xl text-sm text-muted">
        Featured Talent and Featured Opportunities stay at six cards. That cap is the product, not a loading state. There is no checkout in this walkthrough.
      </p>
    </section>
  )
}
