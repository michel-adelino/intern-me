import type { ReactNode } from 'react'
import { cn } from '../demo/cn'

export function SectionHeading({
  children,
  tone = 'ink',
  id,
}: {
  children: ReactNode
  tone?: 'ink' | 'paper'
  id?: string
}) {
  return (
    <h2
      id={id}
      className={cn(
        'font-serif text-2xl font-bold tracking-tight',
        tone === 'paper' ? 'text-paper' : 'text-ink',
      )}
    >
      {children}
    </h2>
  )
}
