import { cn } from '../demo/cn'
import type { WorkMode } from '../types'

const OPTIONS: { id: WorkMode; label: string }[] = [
  { id: 'onsite', label: 'On-site' },
  { id: 'remote', label: 'Remote' },
]

export function ModeSwitch({
  value,
  onChange,
}: {
  value: WorkMode
  onChange: (mode: WorkMode) => void
}) {
  return (
    <div className="inline-flex rounded-full bg-paper p-1" role="group" aria-label="Remote or on-site">
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-semibold',
            value === option.id ? 'bg-ink text-paper' : 'text-ink-soft',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
