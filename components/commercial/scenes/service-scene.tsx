import Image from 'next/image'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { easeInOutCubic, easeOutCubic, easeOutExpo, range } from '@/lib/commercial/timeline'
import { LightSweep, Reveal } from '../motion'

type ServiceSceneProps = {
  local: number
  duration: number
  image: string
  alt: string
  title: string
  subtitle?: string[]
  kenBurnsScale?: number
  screen?: ReactNode
  extra?: ReactNode
  sweep?: boolean
}

export function ServiceScene({
  local,
  duration,
  image,
  alt,
  title,
  subtitle,
  kenBurnsScale,
  screen,
  extra,
  sweep = true,
}: ServiceSceneProps) {
  const drift = range(local, 0, duration + 0.7)
  const isPhone = Boolean(screen)
  const scale = kenBurnsScale ?? 1.1 - 0.08 * easeInOutCubic(drift)
  const parallaxX = isPhone ? 0 : 1.2 * drift

  const exit = 1 - range(local, duration - 0.35, duration + 0.05)
  const line = easeInOutCubic(range(local, 0.3, 0.9))
  const title_ = easeOutExpo(range(local, 0.45, 1.2))

  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      {isPhone ? (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 34% 60% at 28% 50%, color-mix(in oklch, var(--primary) 12%, transparent), transparent 70%)',
            }}
          />
          <div
            className="@container absolute inset-y-[4%] left-[14%] aspect-[9/16] will-change-transform"
            style={{
              transform: `scale(${scale})`,
              maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 74%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 74%, transparent 100%)',
            }}
          >
            <Image src={image} alt={alt} fill priority sizes="(max-width: 640px) 40vw, 420px" className="object-cover" />
            {screen}
          </div>
        </>
      ) : (
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translate3d(${parallaxX}%, 0, 0) scale(${scale})` }}
        >
          <Image src={image} alt={alt} fill priority sizes="(max-width: 640px) 100vw, 1400px" className="object-cover" />
        </div>
      )}

      {sweep && <LightSweep progress={range(local, 0.7, 2.1)} />}

      {!isPhone && (
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-[62%] bg-linear-to-l from-background via-background/80 to-transparent"
        />
      )}

      <div
        lang="ar"
        className="absolute inset-y-0 right-0 flex w-[46%] flex-col items-start justify-center gap-[1.4cqw] px-[6cqw]"
        style={{ opacity: exit }}
      >
        <div className="h-[0.35cqw] w-[6cqw] origin-right bg-primary" style={{ transform: `scaleX(${line})` }} />
        <Reveal progress={title_}>
          <h2
            className={cn(
              'whitespace-nowrap font-sans font-bold leading-tight text-foreground',
              title.length > 14 ? 'text-[3.6cqw]' : 'text-[4.4cqw]',
            )}
          >
            {title}
          </h2>
        </Reveal>
        {subtitle && (
          <p className="flex items-center gap-[1.2cqw] font-sans text-[2cqw] font-medium text-muted-foreground">
            {subtitle.map((word, i) => {
              const p = easeOutCubic(range(local, 0.95 + i * 0.25, 1.45 + i * 0.25))
              return (
                <span key={word} className="flex items-center gap-[1.2cqw]" style={{ opacity: p }}>
                  {i > 0 && <span aria-hidden="true" className="size-[0.55cqw] rounded-full bg-primary" />}
                  <span style={{ transform: `translate3d(0, ${(1 - p) * 40}%, 0)`, display: 'inline-block' }}>
                    {word}
                  </span>
                </span>
              )
            })}
          </p>
        )}
        {extra}
      </div>
    </div>
  )
}
