import { easeInOutCubic, easeOutCubic, easeOutExpo, range } from '@/lib/commercial/timeline'
import { StartechLogo } from '../logo'
import { Reveal } from '../motion'

export function IntroScene({ local }: { local: number }) {
  const lightX = -40 + 180 * easeInOutCubic(range(local, 0, 2.4))
  const logo = easeOutCubic(range(local, 0.5, 1.6))
  const line = easeInOutCubic(range(local, 1.3, 2.1))
  const tagline = easeOutExpo(range(local, 1.8, 2.6))

  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 40% 50% at ${lightX}% 50%, color-mix(in oklch, var(--primary) 16%, transparent), transparent 70%)`,
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[2.4cqw] px-[8cqw]">
        <div
          style={{
            opacity: logo,
            transform: `scale(${0.82 + 0.18 * logo})`,
            filter: `blur(${(1 - logo) * 14}px)`,
          }}
        >
          <StartechLogo className="text-[6.4cqw]" />
        </div>
        <div className="h-px w-[24cqw] origin-center bg-primary" style={{ transform: `scaleX(${line})` }} />
        <Reveal progress={tagline}>
          <p lang="ar" className="text-center font-sans text-[3.2cqw] font-medium text-foreground/90">
            {'كل ما تحتاجه... في مكان واحد'}
          </p>
        </Reveal>
      </div>
    </div>
  )
}
