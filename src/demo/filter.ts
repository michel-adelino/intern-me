import type { WorkFilter, WorkMode } from '../types'

export function parseMode(value: string | null): WorkFilter {
  if (value === 'remote' || value === 'onsite') return value
  return 'all'
}

type Placeable = {
  zip: string
  city: string
  workMode: WorkMode
}

export function matchesFilters(item: Placeable, query: string, mode: WorkFilter): boolean {
  if (mode === 'remote' && item.workMode !== 'remote') return false
  if (mode === 'onsite' && item.workMode !== 'onsite') return false

  const q = query.trim().toLowerCase()
  if (!q) return true
  if (item.workMode === 'remote') return true

  const digits = q.replace(/\D/g, '')
  if (digits.length >= 3 && item.zip.startsWith(digits)) return true
  if (item.city.toLowerCase().includes(q)) return true
  if (item.zip.includes(q)) return true
  return false
}
