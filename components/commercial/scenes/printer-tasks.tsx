import { Copy, Printer, ScanLine } from 'lucide-react'
import { cn } from '@/lib/utils'
import { easeOutCubic, range } from '@/lib/commercial/timeline'

const TASKS = [
  { label: 'طباعة', icon: Printer, from: 1.0, until: 2.2 },
  { label: 'مسح ضوئي', icon: ScanLine, from: 2.2, until: 2.8 },
  { label: 'نسخ', icon: Copy, from: 2.8, until: 9 },
]

export function PrinterTasks({ local }: { local: number }) {
  const progress = range(local, 0.9, 3.3)

  return (
    <div className="flex w-full flex-col gap-[1.4cqw] pt-[0.6cqw]">
      <ul className="flex items-center gap-[1cqw]">
        {TASKS.map((task, i) => {
          const appear = easeOutCubic(range(local, 0.8 + i * 0.18, 1.3 + i * 0.18))
          const active = local >= task.from && local < task.until
          const Icon = task.icon
          return (
            <li
              key={task.label}
              className={cn(
                'flex items-center gap-[0.7cqw] rounded-full border px-[1.4cqw] py-[0.7cqw] font-sans text-[1.6cqw] font-medium transition-colors duration-300',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card/70 text-foreground/80',
              )}
              style={{ opacity: appear, transform: `translate3d(0, ${(1 - appear) * 30}%, 0)` }}
            >
              <Icon className="size-[1.7cqw]" aria-hidden="true" />
              {task.label}
            </li>
          )
        })}
      </ul>
      <div className="h-[0.25cqw] w-full overflow-hidden rounded-full bg-border">
        <div className="h-full origin-right bg-primary" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </div>
  )
}
