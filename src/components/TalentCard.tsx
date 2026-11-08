import { formatPlace, formatRate } from '../demo/format'
import { useDemo } from '../demo/store'
import type { Talent } from '../types'

export function TalentCard({ talent, eager = false }: { talent: Talent; eager?: boolean }) {
  const { openTalent } = useDemo()

  return (
    <button
      type="button"
      onClick={() => openTalent(talent.id)}
      aria-label={`Play ${talent.name}'s reel`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-line bg-card text-left shadow-[0_16px_40px_rgba(22,20,15,0.05)] transition duration-300 hover:-translate-y-1"
    >
      <span className="relative block aspect-[9/16] overflow-hidden bg-ink">
        <img
          src={talent.poster}
          alt=""
          width={800}
          height={1200}
          loading={eager ? 'eager' : 'lazy'}
          className="h-full w-full object-cover transition duration-700 motion-safe:group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/20" />
        <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-paper">
          0:30
        </span>
        {talent.creditEligible ? (
          <span className="absolute right-3 top-3 -rotate-6 rounded-sm border-2 border-lime px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-lime">
            Credit eligible
          </span>
        ) : null}
        <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lime text-ink shadow-lg">
          <svg viewBox="0 0 16 16" className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M5 3.2 13 8 5 12.8V3.2z" />
          </svg>
          <span className="sr-only">Play reel</span>
        </span>
        <span className="absolute inset-x-0 bottom-0 p-4 text-paper">
          <span className="block font-serif text-2xl font-bold leading-none tracking-tight">{talent.name}</span>
          <span className="mt-1 block text-sm text-paper/80">{talent.school}</span>
        </span>
      </span>
      <span className="flex flex-1 flex-col gap-3 p-4">
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-lg font-bold">{formatRate(talent.rate)}</span>
          <span className="text-right text-xs text-muted">{formatPlace(talent.city, talent.zip, talent.workMode)}</span>
        </span>
        <span className="flex flex-wrap gap-1.5">
          {talent.skills.map((skill) => (
            <span key={skill} className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-ink-soft">
              {skill}
            </span>
          ))}
        </span>
      </span>
    </button>
  )
}
