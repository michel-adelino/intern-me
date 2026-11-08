import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Field, fieldClass } from '../components/Field'
import { ModeSwitch } from '../components/ModeSwitch'
import { SectionHeading } from '../components/SectionHeading'
import { SkillPicker } from '../components/SkillPicker'
import { Stepper } from '../components/Stepper'
import { SAMPLE_POSTER, SAMPLE_VIDEO } from '../data/seed'
import { formatPlace, formatRate } from '../demo/format'
import { useDemo } from '../demo/store'
import type { WorkMode } from '../types'

const STEPS = ['Video', 'Details', 'Review'] as const
const MAX_SECONDS = 35

function readDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => resolve(video.duration)
    video.onerror = () => reject(new Error('bad video'))
    video.src = url
  })
}

function captureFrame(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true
    const finish = (value: string | null) => {
      video.removeAttribute('src')
      video.load()
      resolve(value)
    }
    video.onloadeddata = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 480
        canvas.height = 854
        const context = canvas.getContext('2d')
        if (!context || !video.videoWidth) {
          finish(null)
          return
        }
        const scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight)
        const width = video.videoWidth * scale
        const height = video.videoHeight * scale
        context.drawImage(video, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
        const data = canvas.toDataURL('image/jpeg', 0.72)
        finish(data.length > 280000 ? null : data)
      } catch {
        finish(null)
      }
    }
    video.onerror = () => finish(null)
    video.src = url
  })
}

export function PostReel() {
  const navigate = useNavigate()
  const { user, publishTalent, openTalent, setNotice } = useDemo()
  const ownedUrl = useRef<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [fileLabel, setFileLabel] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [poster, setPoster] = useState('')
  const [name, setName] = useState(user?.name ?? '')
  const [school, setSchool] = useState('')
  const [rate, setRate] = useState(24)
  const [skills, setSkills] = useState<string[]>([])
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [workMode, setWorkMode] = useState<WorkMode>('onsite')
  const [creditEligible, setCreditEligible] = useState(true)
  const [blurb, setBlurb] = useState('')

  const keepUrl = (url: string) => {
    if (ownedUrl.current && ownedUrl.current !== url) URL.revokeObjectURL(ownedUrl.current)
    ownedUrl.current = url.startsWith('blob:') ? url : null
    setVideoUrl(url)
  }

  const useSample = () => {
    keepUrl(SAMPLE_VIDEO)
    setPoster(SAMPLE_POSTER)
    setFileLabel('Sample reel')
    setError('')
  }

  const takeFile = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('video/')) {
      setError('Use a video file.')
      return
    }
    const url = URL.createObjectURL(file)
    try {
      const duration = await readDuration(url)
      if (!Number.isFinite(duration)) throw new Error('unreadable')
      if (duration > MAX_SECONDS) {
        URL.revokeObjectURL(url)
        setError(`Reels are 30 seconds. This clip is ${Math.ceil(duration)}s.`)
        return
      }
      keepUrl(url)
      setPoster('')
      setFileLabel(file.name)
      setError('')
    } catch {
      URL.revokeObjectURL(url)
      setError('That file would not play. Try another cut, or use a sample reel.')
    }
  }

  const continueDetails = () => {
    if (!videoUrl) {
      setError('Add a reel, or use the sample so the pitch has something to play.')
      return
    }
    setError('')
    setStep(1)
  }

  const continueReview = () => {
    if (!name.trim() || !school.trim() || !city.trim()) {
      setError('Name, school, and city are required.')
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
    setError('')
    setStep(2)
  }

  const publish = async () => {
    setBusy(true)
    let nextPoster = poster
    if (!nextPoster && videoUrl.startsWith('blob:')) {
      nextPoster = (await captureFrame(videoUrl)) ?? ''
    }
    const id = crypto.randomUUID()
    ownedUrl.current = null
    publishTalent({
      id,
      name: name.trim(),
      school: school.trim(),
      rate,
      skills,
      creditEligible,
      zip,
      city: city.trim(),
      workMode,
      poster: nextPoster || SAMPLE_POSTER,
      videoUrl,
      blurb: blurb.trim() || `Open to work at ${formatRate(rate)}.`,
      ownerEmail: user?.email,
    })
    openTalent(id)
    setNotice('Your reel is on the floor.')
    navigate('/talent')
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Candidate</p>
      <SectionHeading>Post a Reel</SectionHeading>
      <p className="mt-3 text-ink-soft">Three steps. The pitch stays at thirty seconds.</p>
      <div className="mt-8">
        <Stepper steps={STEPS} step={step} />
      </div>

      {step === 0 ? (
        <div className="mt-8">
          <div
            className="rounded-[28px] border border-dashed border-ink/30 bg-card px-6 py-12 text-center"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              void takeFile(event.dataTransfer.files[0])
            }}
          >
            <p className="font-serif text-3xl font-bold">Drop a 30-second pitch</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              Anything past 35 seconds is turned away. If you are walking someone through the demo, the sample reel is ready.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-paper"
              >
                Choose a video
              </button>
              <button type="button" onClick={useSample} className="rounded-full border border-line bg-paper px-5 py-3 text-sm font-bold">
                Use a sample reel
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(event) => {
                void takeFile(event.target.files?.[0])
                event.target.value = ''
              }}
            />
            {fileLabel ? <p className="mt-4 text-sm font-semibold">{fileLabel}</p> : null}
          </div>
          {videoUrl ? (
            <video
              key={videoUrl}
              src={videoUrl}
              poster={poster || undefined}
              controls
              playsInline
              className="mx-auto mt-6 aspect-[9/16] w-full max-w-[280px] rounded-[24px] bg-ink object-cover"
            />
          ) : null}
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-8 grid gap-5">
          <Field label="Name">
            <input className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="School">
            <input className={fieldClass} value={school} onChange={(event) => setSchool(event.target.value)} />
          </Field>
          <Field label={`Rate · ${formatRate(rate)}`} hint="The floor is $20–$28/hr.">
            <input
              type="range"
              min={20}
              max={28}
              step={1}
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
              className="w-full accent-ink"
            />
          </Field>
          <Field label="Skills" group>
            <SkillPicker value={skills} onChange={setSkills} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Zip code">
              <input className={fieldClass} inputMode="numeric" value={zip} onChange={(event) => setZip(event.target.value)} placeholder="10011" />
            </Field>
            <Field label="City">
              <input className={fieldClass} value={city} onChange={(event) => setCity(event.target.value)} placeholder="New York" />
            </Field>
          </div>
          <Field label="Where you can work" group>
            <ModeSwitch value={workMode} onChange={setWorkMode} />
          </Field>
          <Field label="One line" hint="Optional. This sits under the reel.">
            <textarea className={fieldClass} rows={3} value={blurb} onChange={(event) => setBlurb(event.target.value)} />
          </Field>
          <label className="flex items-center justify-between gap-4 rounded-[24px] border border-line bg-card px-4 py-4">
            <span>
              <span className="block text-sm font-bold uppercase tracking-[0.14em]">Credit eligible</span>
              <span className="mt-1 block text-sm text-muted">School credit can cover this work.</span>
            </span>
            <input
              type="checkbox"
              checked={creditEligible}
              onChange={(event) => setCreditEligible(event.target.checked)}
              className="h-5 w-5 accent-ink"
            />
          </label>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-8 rounded-[28px] border border-line bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Ready for the floor</p>
          <h3 className="mt-3 font-serif text-4xl font-bold">{name}</h3>
          <p className="mt-1 text-ink-soft">{school}</p>
          <p className="mt-4 text-xl font-bold">{formatRate(rate)}</p>
          <p className="mt-1 text-sm text-muted">{formatPlace(city, zip, workMode)}</p>
          <p className="mt-4 text-sm">{creditEligible ? 'CREDIT ELIGIBLE' : 'Not marked credit eligible'}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li key={skill} className="rounded-full bg-paper px-3 py-1 text-sm">
                {skill}
              </li>
            ))}
          </ul>
          {blurb.trim() ? <p className="mt-4 text-ink-soft">{blurb}</p> : null}
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
          <button type="button" disabled={busy} onClick={() => void publish()} className="rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink disabled:opacity-60">
            {busy ? 'Publishing…' : 'Publish reel'}
          </button>
        ) : null}
      </div>
    </section>
  )
}
