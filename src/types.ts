export type Role = 'candidate' | 'founder'
export type WorkMode = 'remote' | 'onsite'
export type ListingKind = 'internship' | 'project'
export type WorkFilter = 'all' | 'remote' | 'onsite'

export type User = {
  name: string
  email: string
  role: Role
}

export type Talent = {
  id: string
  name: string
  school: string
  rate: number
  skills: string[]
  creditEligible: boolean
  zip: string
  city: string
  workMode: WorkMode
  poster: string
  videoUrl: string
  blurb: string
  ownerEmail?: string
}

export type Listing = {
  id: string
  title: string
  company: string
  kind: ListingKind
  duration: number
  wageMin: number
  wageMax: number
  skills: string[]
  zip: string
  city: string
  workMode: WorkMode
  summary: string
  ownerEmail?: string
}

export type Application = {
  id: string
  listingId: string
  talentId?: string
  fromEmail: string
  fromName: string
  createdAt: number
}

export type LoginResult = {
  appliedListingId?: string
  blocked?: boolean
}
