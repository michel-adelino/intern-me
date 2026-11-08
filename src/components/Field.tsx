import type { ReactNode } from 'react'

export const fieldClass =
  'w-full rounded-2xl border border-line bg-card px-4 py-3 text-base text-ink outline-none transition focus:border-ink'

export function Field({
  label,
  hint,
  children,
  group = false,
}: {
  label: string
  hint?: string
  children: ReactNode
  group?: boolean
}) {
  if (group) {
    return (
      <fieldset className="block">
        <legend className="mb-1.5 text-sm font-semibold">{label}</legend>
        {children}
        {hint ? <span className="mt-1.5 block text-xs text-muted">{hint}</span> : null}
      </fieldset>
    )
  }

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs text-muted">{hint}</span> : null}
    </label>
  )
}
