import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/SectionHeading'

export function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-5 py-24">
      <SectionHeading>That page is not on the floor.</SectionHeading>
      <Link to="/" className="mt-6 inline-block font-bold underline decoration-lime decoration-2 underline-offset-4">
        Back home
      </Link>
    </section>
  )
}
