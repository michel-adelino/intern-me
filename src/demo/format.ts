import type { ListingKind, WorkMode } from '../types'

export function formatRate(rate: number): string {
  return `$${rate}/hr`
}

export function formatWage(min: number, max: number): string {
  return `$${min}–$${max}/hr`
}

export function formatEngagement(kind: ListingKind, duration: number): string {
  if (kind === 'internship') return `${duration} Mo. Internship`
  return `${duration === 1 ? '1' : duration} Week Project`
}

export function formatPlace(city: string, zip: string, workMode: WorkMode): string {
  const where = `${city} · ${zip}`
  return workMode === 'remote' ? `Remote · ${where}` : `On-site · ${where}`
}

export function formatWhen(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(timestamp)
}

export function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? ''
  const name = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
  return name || 'New member'
}

export function reelFor<T extends { id: string; name: string; ownerEmail?: string }>(
  talent: T[],
  application: { talentId?: string; fromEmail: string; fromName: string },
): T | undefined {
  return (
    talent.find((item) => item.id === application.talentId) ??
    talent.find((item) => item.ownerEmail === application.fromEmail) ??
    talent.find((item) => item.name === application.fromName)
  )
}
