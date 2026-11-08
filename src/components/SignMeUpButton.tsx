import { useNavigate } from 'react-router-dom'
import { cn } from '../demo/cn'
import { useDemo } from '../demo/store'

export function SignMeUpButton({
  listingId,
  className,
}: {
  listingId: string
  className?: string
}) {
  const navigate = useNavigate()
  const { user, applications, applyToListing, setPendingListing, closeTalent } = useDemo()
  const signedUp = user
    ? applications.some((item) => item.listingId === listingId && item.fromEmail === user.email)
    : false

  if (user?.role === 'founder') {
    return (
      <p className={cn('max-w-[16rem] text-sm leading-snug text-ink-soft', className)}>
        Switch to a candidate account to apply.
      </p>
    )
  }

  if (signedUp) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          'inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-bold text-lime',
          className,
        )}
      >
        Signed up
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        if (!user) {
          setPendingListing(listingId)
          closeTalent()
          navigate('/login')
          return
        }
        applyToListing(listingId)
      }}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink transition hover:brightness-105',
        className,
      )}
    >
      SignMeUp
    </button>
  )
}
