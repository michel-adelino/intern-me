import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useDemo } from '../demo/store'
import { Footer } from './Footer'
import { Header } from './Header'
import { ReelModal } from './ReelModal'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function Layout() {
  const { notice, dismissNotice } = useDemo()

  return (
    <div className="flex min-h-svh flex-col bg-paper text-ink">
      <ScrollToTop />
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-lime focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ReelModal />
      {notice ? (
        <div className="fixed inset-x-0 bottom-5 z-[80] flex justify-center px-4">
          <button
            type="button"
            onClick={dismissNotice}
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper shadow-2xl"
          >
            {notice}
          </button>
        </div>
      ) : null}
    </div>
  )
}
