import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/SectionHeading'
import { formatEngagement, formatWhen, reelFor } from '../demo/format'
import { useDemo } from '../demo/store'

export function Dashboard() {
  const { user, talent, listings, applications, openTalent } = useDemo()

  if (!user) {
    return (
      <section className="mx-auto max-w-xl px-5 py-20 text-center">
        <SectionHeading>Log in to see your side of the floor.</SectionHeading>
        <Link to="/login" className="mt-6 inline-flex rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink">
          Log in
        </Link>
      </section>
    )
  }

  const myReels = talent.filter((item) => item.ownerEmail === user.email)
  const myApplications = applications.filter((item) => item.fromEmail === user.email)
  const myListings = listings.filter((item) => item.ownerEmail === user.email)

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
        {user.role === 'candidate' ? 'Candidate' : 'Founder'}
      </p>
      <SectionHeading>{user.name}</SectionHeading>
      <p className="mt-2 text-sm text-muted">{user.email}</p>

      {user.role === 'candidate' ? (
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="font-serif text-2xl font-bold">Your reel</h3>
            {myReels.length === 0 ? (
              <div className="mt-4 rounded-[28px] border border-dashed border-line p-6">
                <p className="text-ink-soft">Nothing on the floor under this email yet.</p>
                <Link to="/post-reel" className="mt-4 inline-block text-sm font-bold underline decoration-lime decoration-2 underline-offset-4">
                  Post a Reel
                </Link>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {myReels.map((reel) => (
                  <li key={reel.id} className="flex items-center gap-4 rounded-[24px] border border-line bg-card p-3">
                    <img src={reel.poster} alt="" className="h-20 w-14 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{reel.name}</p>
                      <p className="text-sm text-muted">{reel.school}</p>
                    </div>
                    <button type="button" onClick={() => openTalent(reel.id)} className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-paper">
                      Watch
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold">SignMeUps</h3>
            {myApplications.length === 0 ? (
              <div className="mt-4 rounded-[28px] border border-dashed border-line p-6">
                <p className="text-ink-soft">You have not signed up for a role yet.</p>
                <Link to="/opportunities" className="mt-4 inline-block text-sm font-bold underline decoration-lime decoration-2 underline-offset-4">
                  See opportunities
                </Link>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {myApplications.map((application) => {
                  const listing = listings.find((item) => item.id === application.listingId)
                  return (
                    <li key={application.id} className="rounded-[24px] border border-line bg-card p-4">
                      <p className="font-semibold">{listing?.title ?? 'Role'}</p>
                      <p className="text-sm text-muted">{listing?.company}</p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-ink">Signed up · {formatWhen(application.createdAt)}</p>
                      {listing ? (
                        <Link to={`/opportunities/${listing.id}`} className="mt-3 inline-block text-sm font-bold underline decoration-lime decoration-2 underline-offset-4">
                          View role
                        </Link>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h3 className="font-serif text-2xl font-bold">Your listings</h3>
            <Link to="/post-project" className="text-sm font-bold underline decoration-lime decoration-2 underline-offset-4">
              Post a Job/Project
            </Link>
          </div>
          {myListings.length === 0 ? (
            <div className="mt-4 rounded-[28px] border border-dashed border-line p-6">
              <p className="text-ink-soft">
                No listings on this email. Log in as Jordan Alvarez to see a studio inbox that already has SignMeUps.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-5">
              {myListings.map((listing) => {
                const applicants = applications.filter((item) => item.listingId === listing.id)
                return (
                  <li key={listing.id} className="rounded-[28px] border border-line bg-card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                          {formatEngagement(listing.kind, listing.duration)}
                        </p>
                        <h4 className="mt-1 font-serif text-2xl font-bold">{listing.title}</h4>
                        <p className="text-sm text-muted">{listing.company}</p>
                      </div>
                      <Link to={`/opportunities/${listing.id}`} className="text-sm font-bold underline decoration-lime decoration-2 underline-offset-4">
                        Open
                      </Link>
                    </div>
                    {applicants.length === 0 ? (
                      <p className="mt-4 text-sm text-muted">No SignMeUps yet.</p>
                    ) : (
                      <ul className="mt-4 divide-y divide-line">
                        {applicants.map((application) => {
                          const reel = reelFor(talent, application)
                          return (
                            <li key={application.id} className="flex flex-wrap items-center gap-3 py-3">
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold">{application.fromName}</p>
                                <p className="text-xs text-muted">Signed up · {formatWhen(application.createdAt)}</p>
                              </div>
                              {reel ? (
                                <button
                                  type="button"
                                  onClick={() => openTalent(reel.id)}
                                  className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-paper"
                                >
                                  Watch reel
                                </button>
                              ) : (
                                <span className="text-sm text-muted">No reel on file</span>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
