import { SKILL_OPTIONS } from '../data/seed'
import { cn } from '../demo/cn'

export function SkillPicker({
  value,
  onChange,
}: {
  value: string[]
  onChange: (skills: string[]) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {SKILL_OPTIONS.map((skill) => {
        const on = value.includes(skill)
        return (
          <button
            key={skill}
            type="button"
            aria-pressed={on}
            onClick={() =>
              onChange(on ? value.filter((item) => item !== skill) : [...value, skill])
            }
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm font-medium transition',
              on ? 'border-ink bg-ink text-paper' : 'border-line bg-card text-ink hover:border-ink',
            )}
          >
            {skill}
          </button>
        )
      })}
    </div>
  )
}
