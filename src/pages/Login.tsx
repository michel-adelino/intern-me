import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SectionHeading } from '../components/SectionHeading'
import { DEMO_CANDIDATE, DEMO_FOUNDER } from '../data/seed'
import { cn } from '../demo/cn'
import { nameFromEmail } from '../demo/format'
import { useDemo } from '../demo/store'
import type { Role, User } from '../types'

export function Login() {
  const navigate = useNavigate()
  const { user, pendingListingId, login, logout, applyToListing, clearPending, setNotice } = useDemo()
  const [role, setRole] = useState<Role>('candidate')
  const [email, setEmail] = useState('')
  const [sentTo, setSentTo] = useState('')
  const [error, setError] = useState('')
  const persona = role === 'candidate' ? DEMO_CANDIDATE : DEMO_FOUNDER

  useEffect(() => {
    if (!user || !pendingListingId) return
    if (user.role !== 'candidate') {
      clearPending()
      setNotice('Switch to a candidate account to apply.')
      return
    }
    applyToListing(pendingListingId)
    navigate(`/opportunities/${pendingListingId}`)
  }, [applyToListing, clearPending, navigate, pendingListingId, setNotice, user])

  const finish = (next: User) => {
    const result = login(next)
    if (result.appliedListingId) {
      navigate(`/opportunities/${result.appliedListingId}`)
      return
    }
    navigate('/dashboard')
  }

  const sendLink = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter an email. The link never leaves this demo.')
      return
    }
    setError('')
    setSentTo(trimmed)
  }

  return (
    <section className="grid min-h-[70svh] lg:grid-cols-2">
      <div className="bg-ink px-8 py-16 text-paper lg:px-14">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime">Magic link</p>
        <h1 className="mt-4 max-w-md font-serif text-5xl font-bold leading-[0.95] tracking-tight">
          Come back as the person who posted, or the person who signed up.
        </h1>
        <p className="mt-6 max-w-md text-paper/70">
          {pendingListingId
            ? 'SignMeUp is waiting. Open the link as a candidate and you are on the list.'
            : 'Email is a magic link. Google and GitHub, in this walkthrough, sign in as a labeled demo account for the role you pick.'}
        </p>
      </div>
      <div className="px-6 py-14 sm:px-12">
        {user ? (
          <div>
            <SectionHeading>You’re in as {user.name}</SectionHeading>
            <p className="mt-3 text-ink-soft">
              {user.role === 'candidate' ? 'Candidate' : 'Founder'} · {user.email}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dashboard" className="rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink">
                Dashboard
              </Link>
              <button type="button" onClick={logout} className="rounded-full border border-line px-5 py-3 text-sm font-bold">
                Log out
              </button>
            </div>
          </div>
        ) : (
          <div>
            <SectionHeading>Log in</SectionHeading>
            <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-card p-1" role="group" aria-label="Account type">
              {([
                ['candidate', 'Candidate'],
                ['founder', 'Founder'],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={role === id}
                  onClick={() => setRole(id)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-bold',
                    role === id ? 'bg-ink text-paper' : 'text-ink-soft',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {sentTo ? (
              <div className="mt-8 rounded-[28px] border border-line bg-card p-6">
                <p className="font-serif text-3xl font-bold">Check your inbox</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  A magic link is waiting at {sentTo}. This demo opens it here, as a {role}.
                </p>
                <button
                  type="button"
                  onClick={() => finish({ email: sentTo, name: nameFromEmail(sentTo), role })}
                  className="mt-6 rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink"
                >
                  Open magic link
                </button>
              </div>
            ) : (
              <form className="mt-8" onSubmit={sendLink}>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={persona.email}
                    className="w-full rounded-2xl border border-line bg-card px-4 py-3 outline-none focus:border-ink"
                  />
                </label>
                {error ? <p className="mt-3 text-sm font-semibold text-red-800">{error}</p> : null}
                <button type="submit" className="mt-4 rounded-full bg-ink px-5 py-3 text-sm font-bold text-paper">
                  Email me a magic link
                </button>
              </form>
            )}

            <div className="mt-8 grid gap-3">
              <button type="button" onClick={() => finish(persona)} className="rounded-full border border-line bg-card px-5 py-3 text-left text-sm font-bold">
                Continue with Google · {persona.name}
              </button>
              <button type="button" onClick={() => finish(persona)} className="rounded-full border border-line bg-card px-5 py-3 text-left text-sm font-bold">
                Continue with GitHub · {persona.name}
              </button>
              <p className="text-xs leading-relaxed text-muted">
                Demo account: {persona.name}, {persona.role}. Maya already has a reel and a SignMeUp. Jordan already has listings and applicants.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
