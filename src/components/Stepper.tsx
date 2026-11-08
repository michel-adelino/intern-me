import { cn } from '../demo/cn'

export function Stepper({ steps, step }: { steps: readonly string[]; step: number }) {
  return (
    <ol className="flex flex-wrap gap-x-5 gap-y-2">
      {steps.map((label, index) => {
        const state = index === step ? 'current' : index < step ? 'done' : 'upcoming'
        return (
          <li key={label} className="inline-flex items-center gap-2 text-sm font-semibold" aria-current={state === 'current' ? 'step' : undefined}>
            <span
              className={cn(
                'grid h-7 w-7 place-items-center rounded-full text-xs',
                state === 'current' && 'bg-lime text-ink',
                state === 'done' && 'bg-ink text-paper',
                state === 'upcoming' && 'bg-line text-ink-soft',
              )}
            >
              {index + 1}
            </span>
            <span className={state === 'upcoming' ? 'text-muted' : 'text-ink'}>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
