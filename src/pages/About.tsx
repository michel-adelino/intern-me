import { SectionHeading } from '../components/SectionHeading'

const STACK = [
  {
    name: 'Cloudflare Stream',
    copy: 'Direct upload, transcoding, thumbnails, and HLS playback for the thirty-second pitch.',
  },
  {
    name: 'Cloudflare R2',
    copy: 'Raw media stays in zero-egress storage. The player never pulls the original file through a metered bucket.',
  },
  {
    name: 'Supabase',
    copy: 'Postgres for profiles, listings, and SignMeUp. Magic-link auth, with social login beside it. Row Level Security on every table.',
  },
  {
    name: 'Workers, DNS, WAF',
    copy: 'Signed upload tokens, webhook handling, and application checks at the edge. DNS and the firewall sit in front of the floor.',
  },
]

export function About() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">The short version</p>
      <SectionHeading>A reel, a role, one click</SectionHeading>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
          <p>
            InternMe is a two-sided floor. One side is student and junior talent. The other is early-stage founders and makers who have a real piece of work and no time for a hiring stack.
          </p>
          <p>
            The candidate does not upload a résumé and hope. They record a thirty-second pitch: who they are, what they can do, what they charge, and whether the hours can count as school credit. The founder does not post a vague “internship.” They post a 3–12 month internship or a 1–8 week project, with a wage and a place.
          </p>
          <p>
            SignMeUp is the handshake. A candidate who is logged in clicks once. The reel is attached. The founder watches it from the dashboard and decides.
          </p>
        </div>
        <div className="rounded-[28px] bg-ink p-8 text-paper">
          <p className="font-serif text-3xl font-bold leading-tight tracking-tight">
            Six cards. Then stop. A crowded grid is how a marketplace starts lying about what is good.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-paper/70">
            Zip code and city filters exist because some of this work happens in a room. Remote is a choice, not the default excuse.
          </p>
        </div>
      </div>

      <div className="mt-16">
        <SectionHeading>How Phase 1 is built</SectionHeading>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Production plan. This demo runs entirely in the browser so the flows can be walked without an account on the live stack.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {STACK.map((item) => (
            <li key={item.name} className="rounded-[24px] border border-line bg-card p-6">
              <h3 className="font-serif text-2xl font-bold">{item.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.copy}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
