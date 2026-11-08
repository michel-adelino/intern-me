import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { SAMPLE_VIDEO, SEED_APPLICATIONS, SEED_LISTINGS, SEED_TALENT } from '../data/seed'
import type { Application, Listing, LoginResult, Talent, User } from '../types'

const STORAGE_KEY = 'internme-demo-v1'

type Persisted = {
  version: 1
  user: User | null
  extraTalent: Talent[]
  extraListings: Listing[]
  extraApplications: Application[]
  pendingListingId: string | null
}

type DemoContextValue = {
  user: User | null
  talent: Talent[]
  listings: Listing[]
  applications: Application[]
  pendingListingId: string | null
  notice: string | null
  openTalentId: string | null
  openTalent: (id: string) => void
  closeTalent: () => void
  login: (user: User) => LoginResult
  logout: () => void
  applyToListing: (listingId: string) => boolean
  setPendingListing: (listingId: string) => void
  clearPending: () => void
  publishTalent: (talent: Talent) => void
  publishListing: (listing: Listing) => void
  dismissNotice: () => void
  setNotice: (message: string) => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

function emptyPersisted(): Persisted {
  return {
    version: 1,
    user: null,
    extraTalent: [],
    extraListings: [],
    extraApplications: [],
    pendingListingId: null,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readPersisted(): Persisted {
  const empty = emptyPersisted()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || parsed.version !== 1) return empty
    return {
      version: 1,
      user: isRecord(parsed.user) ? (parsed.user as User) : null,
      extraTalent: Array.isArray(parsed.extraTalent) ? (parsed.extraTalent as Talent[]) : [],
      extraListings: Array.isArray(parsed.extraListings) ? (parsed.extraListings as Listing[]) : [],
      extraApplications: Array.isArray(parsed.extraApplications)
        ? (parsed.extraApplications as Application[])
        : [],
      pendingListingId: typeof parsed.pendingListingId === 'string' ? parsed.pendingListingId : null,
    }
  } catch {
    return empty
  }
}

function safeTalent(talent: Talent): Talent {
  if (!talent.videoUrl.startsWith('blob:')) return talent
  return { ...talent, videoUrl: SAMPLE_VIDEO }
}

function alreadyApplied(listingId: string, email: string, extra: Application[]): boolean {
  return [...SEED_APPLICATIONS, ...extra].some(
    (item) => item.listingId === listingId && item.fromEmail === email,
  )
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<Persisted>(readPersisted)
  const [notice, setNotice] = useState<string | null>(null)
  const [openTalentId, setOpenTalentId] = useState<string | null>(null)

  useEffect(() => {
    const payload: Persisted = {
      ...persisted,
      extraTalent: persisted.extraTalent.map(safeTalent),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [persisted])

  useEffect(() => {
    if (!notice) return
    const id = window.setTimeout(() => setNotice(null), 3800)
    return () => window.clearTimeout(id)
  }, [notice])

  const talent = useMemo(
    () => [...persisted.extraTalent, ...SEED_TALENT],
    [persisted.extraTalent],
  )
  const listings = useMemo(
    () => [...persisted.extraListings, ...SEED_LISTINGS],
    [persisted.extraListings],
  )
  const applications = useMemo(
    () => [...SEED_APPLICATIONS, ...persisted.extraApplications],
    [persisted.extraApplications],
  )

  const value = useMemo<DemoContextValue>(() => {
    const attachTalent = (email: string, name: string) =>
      talent.find((item) => item.ownerEmail === email)?.id ??
      talent.find((item) => item.name === name)?.id

    const addApplication = (listingId: string, applicant: User, extra: Application[]) => {
      if (alreadyApplied(listingId, applicant.email, extra)) return extra
      const next: Application = {
        id: `app-${applicant.email}-${listingId}`,
        listingId,
        talentId: attachTalent(applicant.email, applicant.name),
        fromEmail: applicant.email,
        fromName: applicant.name,
        createdAt: Date.now(),
      }
      return [...extra, next]
    }

    return {
      user: persisted.user,
      talent,
      listings,
      applications,
      pendingListingId: persisted.pendingListingId,
      notice,
      openTalentId,
      openTalent: (id: string) => setOpenTalentId(id),
      closeTalent: () => setOpenTalentId(null),
      dismissNotice: () => setNotice(null),
      setNotice,
      setPendingListing: (listingId: string) =>
        setPersisted((current) => ({ ...current, pendingListingId: listingId })),
      clearPending: () => setPersisted((current) => ({ ...current, pendingListingId: null })),
      login: (user: User) => {
        const pending = persisted.pendingListingId
        const result: LoginResult = {}
        if (pending && user.role === 'candidate') result.appliedListingId = pending
        if (pending && user.role === 'founder') result.blocked = true
        setPersisted((current) => ({
          ...current,
          user,
          pendingListingId: null,
          extraApplications:
            current.pendingListingId && user.role === 'candidate'
              ? addApplication(current.pendingListingId, user, current.extraApplications)
              : current.extraApplications,
        }))
        if (result.appliedListingId) setNotice("You're signed up.")
        if (result.blocked) setNotice('Switch to a candidate account to apply.')
        return result
      },
      logout: () => setPersisted((current) => ({ ...current, user: null })),
      applyToListing: (listingId: string) => {
        const applicant = persisted.user
        if (!applicant || applicant.role !== 'candidate') return false
        const fresh = !alreadyApplied(listingId, applicant.email, persisted.extraApplications)
        setPersisted((current) => ({
          ...current,
          pendingListingId: null,
          extraApplications: addApplication(listingId, applicant, current.extraApplications),
        }))
        if (fresh) setNotice("You're signed up.")
        return true
      },
      publishTalent: (next: Talent) =>
        setPersisted((current) => ({
          ...current,
          extraTalent: [next, ...current.extraTalent.filter((item) => item.id !== next.id)],
        })),
      publishListing: (next: Listing) =>
        setPersisted((current) => ({
          ...current,
          extraListings: [next, ...current.extraListings.filter((item) => item.id !== next.id)],
        })),
    }
  }, [applications, listings, notice, openTalentId, persisted, talent])

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo(): DemoContextValue {
  const context = useContext(DemoContext)
  if (!context) throw new Error('useDemo must be used within DemoProvider')
  return context
}
