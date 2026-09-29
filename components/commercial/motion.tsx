import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Reveal({
  progress,
  children,
  className,
}: {
  progress: number
  children: ReactNode
  className?: string
}) {
  return (
    <span className={cn('block overflow-hidden py-[1cqw]', className)}>
      <span
        className="block will-change-transform"
        style={{ transform: `translate3d(0, ${(1 - progress) * 115}%, 0)`, opacity: progress }}
      >
        {children}
      </span>
    </span>
  )
}

export function LightSweep({ progress }: { progress: number }) {
  if (progress <= 0 || progress >= 1) return null
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-y-[-10%] w-[45%] bg-linear-to-r from-transparent via-foreground/10 to-transparent"
        style={{
          transform: `translate3d(${-120 + progress * 360}%, 0, 0) skewX(-14deg)`,
          opacity: Math.sin(progress * Math.PI),
        }}
      />
    </div>
  )
}
