import { useState } from 'react'
import { TESTIMONIALS } from '../data/seed'
import { SectionHeading } from './SectionHeading'

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0)
  const item = TESTIMONIALS[index]
  const last = TESTIMONIALS.length

  const go = (direction: -1 | 1) => {
    setIndex((current) => (current + direction + last) % last)
  }

  return (
    <section className="bg-ink text-paper" aria-roledescription="carousel" aria-label="Notes from the floor">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <SectionHeading tone="paper">In their words</SectionHeading>
        <figure className="mt-8" aria-live="polite">
          <blockquote className="font-serif text-3xl font-bold leading-snug tracking-tight sm:text-4xl">
            “{item.quote}”
          </blockquote>
          <figcaption className="mt-8 text-sm">
            <span className="block font-semibold text-lime">{item.name}</span>
            <span className="mt-1 block text-paper/60">{item.role}</span>
          </figcaption>
        </figure>
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20"
          >
            <span aria-hidden="true">←</span>
          </button>
          <p className="min-w-14 text-xs font-semibold tracking-[0.16em] text-paper/50">
            {index + 1} / {last}
          </p>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}
