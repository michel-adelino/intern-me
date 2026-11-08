import { Link } from 'react-router-dom'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">
            Thirty-second pitches for founders who do not have a recruiting team, and for students who do not have a spare afternoon.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm font-semibold">
          <Link to="/post-reel" className="hover:text-lime">
            Post a Reel
          </Link>
          <Link to="/post-project" className="hover:text-lime">
            Post a Job/Project
          </Link>
          <p className="max-w-xs pt-2 text-xs font-medium leading-relaxed text-paper/50">
            Phase 1 walkthrough. Playback, accounts, and listings stay in this browser.
          </p>
        </div>
      </div>
    </footer>
  )
}
