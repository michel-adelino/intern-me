import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Field, fieldClass } from '../components/Field'
import { ModeSwitch } from '../components/ModeSwitch'
import { SectionHeading } from '../components/SectionHeading'
import { SkillPicker } from '../components/SkillPicker'
import { Stepper } from '../components/Stepper'
import { formatEngagement, formatPlace, formatWage } from '../demo/format'
import { useDemo } from '../demo/store'
import type { ListingKind, WorkMode } from '../types'

const STEPS = ['Engagement', 'Details', 'Review'] as const

export function PostProject() {
  const navigate = useNavigate()
  const { user, publishListing, setNotice } = useDemo()
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [kind, setKind] = useState<ListingKind>('internship')
  const [duration, setDuration] = useState(6)
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [summary, setSummary] = useState('')
  const [wageMin, setWageMin] = useState(22)
  const [wageMax, setWageMax] = useState(28)
  const [skills, setSkills] = useState<string[]>([])
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [workMode, setWorkMode] = useState<WorkMode>('onsite')

  const chooseKind = (next: ListingKind) => {
    setKind(next)
    setDuration((current) => {
      if (next === 'internship') return Math.min(12, Math.max(3, current < 3 ? 6 : current))
      return Math.min(8, Math.max(1, current > 8 ? 4 : current))
    })
  }

  const bounds = kind === 'internship' ? { min: 3, max: 12, unit: 'months' } : { min: 1, max: 8, unit: 'weeks' }

  const continueDetails = () => {
    setError('')
    setStep(1)
  }

  const continueReview = () => {
    if (!title.trim() || !company.trim() || !summary.trim() || !city.trim()) {
      setError('Title, company, city, and a short description are required.')
      return
    }
    if (!/^\d{5}$/.test(zip)) {
      setError('Use a 5-digit zip code.')
      return
    }
    if (skills.length === 0) {
      setError('Pick at least one skill.')
      return
    }
    if (!Number.isFinite(wageMin) || !Number.isFinite(wageMax) || wageMin < 15 || wageMax > 80 || wageMin > wageMax) {
      setError('Keep the hourly range between $15 and $80, low to high.')
      return
    }
    if (duration < bounds.min || duration > bounds.max) {
      setError(`Keep this ${kind} between ${bounds.min} and ${bounds.max} ${bounds.unit}.`)
      return
    }
    setError('')
    setStep(2)
  }

  const publish = () => {
    publishListing({
      id: crypto.randomUUID(),
      title: title.trim(),
      company: company.trim(),
      kind,
      duration,
      wageMin,
      wageMax,
      skills,
      zip,
      city: city.trim(),
      workMode,
      summary: summary.trim(),
      ownerEmail: user?.email,
    })
    setNotice('Your listing is on the floor.')
    navigate('/opportunities')
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Founder</p>
      <SectionHeading>Post a Job/Project</SectionHeading>
      <p className="mt-3 text-ink-soft">An internship with a season, or a project with an ending.</p>
      <div className="mt-8">
        <Stepper steps={STEPS} step={step} />
      </div>

      {step === 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            aria-pressed={kind === 'internship'}
            onClick={() => chooseKind('internship')}
            className={`rounded-[28px] border p-6 text-left ${kind === 'internship' ? 'border-ink bg-ink text-paper' : 'border-line bg-card'}`}
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em]">Internship</p>
            <p className="mt-3 font-serif text-3xl font-bold">3–12 Mo.</p>
            <p className={`mt-3 text-sm leading-relaxed ${kind === 'internship' ? 'text-paper/70' : 'text-muted'}`}>
              A season inside the company. Long enough to own something, short enough to stay honest.
            </p>
          </button>
          <button
            type="button"
            aria-pressed={kind === 'project'}
            onClick={() => chooseKind('project')}
            className={`rounded-[28px] border p-6 text-left ${kind === 'project' ? 'border-ink bg-ink text-paper' : 'border-line bg-card'}`}
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em]">Project</p>
            <p className="mt-3 font-serif text-3xl font-bold">1–8 Weeks</p>
            <p className={`mt-3 text-sm leading-relaxed ${kind === 'project' ? 'text-paper/70' : 'text-muted'}`}>
              A bounded piece of work. The listing says when it ends.
            </p>
          </button>
          <div className="sm:col-span-2">
            <Field label={`Length · ${duration} ${bounds.unit}`}>
              <input
                type="range"
                min={bounds.min}
                max={bounds.max}
                step={1}
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value))}
                className="w-full accent-ink"
              />
            </Field>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-8 grid gap-5">
          <Field label="Title">
            <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Founding design intern" />
          </Field>
          <Field label="Company">
            <input className={fieldClass} value={company} onChange={(event) => setCompany(event.target.value)} />
          </Field>
          <Field label="What the work actually is">
            <textarea className={fieldClass} rows={4} value={summary} onChange={(event) => setSummary(event.target.value)} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Wage from" hint="Hourly, in dollars.">
              <input className={fieldClass} type="number" min={15} max={80} value={wageMin} onChange={(event) => setWageMin(Number(event.target.value))} />
            </Field>
            <Field label="Wage to">
              <input className={fieldClass} type="number" min={15} max={80} value={wageMax} onChange={(event) => setWageMax(Number(event.target.value))} />
            </Field>
          </div>
          <Field label="Skills" group>
            <SkillPicker value={skills} onChange={setSkills} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Zip code">
              <input className={fieldClass} inputMode="numeric" value={zip} onChange={(event) => setZip(event.target.value)} placeholder="10013" />
            </Field>
            <Field label="City">
              <input className={fieldClass} value={city} onChange={(event) => setCity(event.target.value)} placeholder="New York" />
            </Field>
          </div>
          <Field label="Where the work happens" group>
            <ModeSwitch value={workMode} onChange={setWorkMode} />
          </Field>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-8 rounded-[28px] border border-line bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{formatEngagement(kind, duration)}</p>
          <h3 className="mt-3 font-serif text-4xl font-bold">{title}</h3>
          <p className="mt-1 text-ink-soft">{company}</p>
          <p className="mt-4 text-xl font-bold">{formatWage(wageMin, wageMax)}</p>
          <p className="mt-1 text-sm text-muted">{formatPlace(city, zip, workMode)}</p>
          <p className="mt-4 leading-relaxed text-ink-soft">{summary}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li key={skill} className="rounded-full bg-paper px-3 py-1 text-sm">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {error ? <p className="mt-4 text-sm font-semibold text-red-800">{error}</p> : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => { setError(''); setStep((current) => current - 1) }} className="rounded-full border border-line px-5 py-3 text-sm font-bold">
            Back
          </button>
        ) : null}
        {step === 0 ? (
          <button type="button" onClick={continueDetails} className="rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink">
            Continue
          </button>
        ) : null}
        {step === 1 ? (
          <button type="button" onClick={continueReview} className="rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink">
            Review
          </button>
        ) : null}
        {step === 2 ? (
          <button type="button" onClick={publish} className="rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink">
            Publish listing
          </button>
        ) : null}
      </div>
    </section>
  )
}
