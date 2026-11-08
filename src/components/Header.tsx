import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../demo/cn'
import { useDemo } from '../demo/store'
import { Logo } from './Logo'

const LINKS = [
  { to: '/post-reel', label: 'Post a Reel' },
  { to: '/post-project', label: 'Post a Job/Project' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
]

function linkClass(isActive: boolean, onDark = true) {
  return cn(
    'whitespace-nowrap text-sm font-semibold',
    isActive ? 'text-lime' : onDark ? 'text-paper/80 hover:text-paper' : 'text-ink',
  )
}

export function Header() {
  const { user, logout, closeTalent } = useDemo()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(location.pathname)
  const accountRef = useRef<HTMLDivElement>(null)

  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname)
    setMenuOpen(false)
    setAccountOpen(false)
  }

  useEffect(() => {
    if (!accountOpen) return
    const onPointer = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [accountOpen])

  const closeAndLogout = () => {
    logout()
    setAccountOpen(false)
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink text-paper">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo onClick={closeTalent} />
        <nav className="hidden items-center gap-5 min-[760px]:flex" aria-label="Primary">
          {LINKS.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={closeTalent} className={({ isActive }) => linkClass(isActive)}>
              {item.label}
            </NavLink>
          ))}
          {user ? (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                onClick={() => setAccountOpen((open) => !open)}
                className="rounded-full bg-lime px-4 py-2 text-sm font-bold text-ink"
              >
                {user.name.split(' ')[0]}
              </button>
              {accountOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl bg-card text-ink shadow-2xl"
                >
                  <Link role="menuitem" to="/dashboard" className="block px-4 py-3 text-sm font-semibold hover:bg-paper">
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={closeAndLogout}
                    className="block w-full px-4 py-3 text-left text-sm font-semibold hover:bg-paper"
                  >
                    Log out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <NavLink
              to="/login"
              className="rounded-full bg-lime px-4 py-2 text-sm font-bold text-ink"
            >
              Log in
            </NavLink>
          )}
        </nav>
        <button
          type="button"
          className="rounded-full border border-white/20 px-3 py-2 text-sm font-semibold min-[760px]:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>
      {menuOpen ? (
        <nav id="mobile-nav" className="border-t border-white/10 px-5 py-4 min-[760px]:hidden" aria-label="Primary">
          <ul className="flex flex-col gap-3">
            {LINKS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} onClick={closeTalent} className={({ isActive }) => linkClass(isActive)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              {user ? (
                <div className="flex flex-col gap-3 pt-1">
                  <Link to="/dashboard" className="text-sm font-semibold text-lime">
                    {user.name.split(' ')[0]} · Dashboard
                  </Link>
                  <button type="button" onClick={closeAndLogout} className="text-left text-sm font-semibold text-paper/80">
                    Log out
                  </button>
                </div>
              ) : (
                <NavLink to="/login" className="text-sm font-bold text-lime">
                  Log in
                </NavLink>
              )}
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
