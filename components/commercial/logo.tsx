import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export function StartechMark({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('text-primary', className)} style={style}>
      <path
        fill="currentColor"
        d="M12 0C12.9 7.4 16.6 11.1 24 12C16.6 12.9 12.9 16.6 12 24C11.1 16.6 7.4 12.9 0 12C7.4 11.1 11.1 7.4 12 0Z"
      />
    </svg>
  )
}

export function StartechLogo({
  className,
  markRotation = 0,
}: {
  className?: string
  markRotation?: number
}) {
  return (
    <div dir="ltr" className={cn('flex items-center gap-[0.35em] font-display leading-none', className)}>
      <StartechMark className="size-[0.9em]" style={{ transform: `rotate(${markRotation}deg)` }} />
      <span className="font-bold tracking-[0.14em] text-foreground">
        STAR<span className="text-primary">TECH</span>
      </span>
    </div>
  )
}
