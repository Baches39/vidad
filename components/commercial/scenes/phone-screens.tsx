import { Check, Gamepad2, Gem, Wifi } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { easeOutBack, easeOutCubic, range } from '@/lib/commercial/timeline'

function ScreenFrame({ children, on }: { children: ReactNode; on: number }) {
  return (
    <div
      lang="ar"
      dir="rtl"
      className="absolute bottom-[21.2%] left-[27.4%] right-[27.4%] top-[22.4%] overflow-hidden rounded-[3.4cqw] bg-card font-sans text-foreground"
      style={{ opacity: on }}
    >
      {children}
    </div>
  )
}

function SignalBars({ filled }: { filled: number }) {
  return (
    <span className="flex items-end gap-[0.4cqw]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn('w-[0.7cqw] rounded-[0.2cqw]', i < filled ? 'bg-foreground' : 'bg-foreground/25')}
          style={{ height: `${1 + i * 0.6}cqw` }}
        />
      ))}
    </span>
  )
}

function StatusBar({ bars = 4 }: { bars?: number }) {
  return (
    <div dir="ltr" className="flex items-center justify-between px-[3cqw] pb-[1cqw] pt-[3.4cqw] text-[2.2cqw] font-semibold">
      <span>9:41</span>
      <span className="flex items-center gap-[1cqw]">
        <SignalBars filled={bars} />
        <Wifi className="size-[2.6cqw]" aria-hidden="true" />
      </span>
    </div>
  )
}

const PACKS = [
  { gems: '100', price: '200' },
  { gems: '310', price: '600' },
  { gems: '520', price: '1000' },
  { gems: '1060', price: '2000' },
]

export function GameTopUpScreen({ local }: { local: number }) {
  const on = easeOutCubic(range(local, 0.25, 0.7))
  const selected = local >= 1.2 ? 2 : -1
  const pressed = local >= 1.7 && local < 1.88
  const confirm = easeOutBack(range(local, 2.0, 2.45))
  const confirmFade = range(local, 1.95, 2.15)

  return (
    <ScreenFrame on={on}>
      <StatusBar />
      <div className="flex flex-col gap-[2.2cqw] px-[3cqw] pt-[1.5cqw]">
        <div className="flex items-center gap-[1.8cqw]">
          <span className="flex size-[6.5cqw] items-center justify-center rounded-[1.6cqw] bg-primary text-primary-foreground">
            <Gamepad2 className="size-[3.8cqw]" aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="text-[3cqw] font-bold leading-snug">{'شحن الألعاب'}</span>
            <span className="text-[2.2cqw] text-muted-foreground">{'اختر الباقة'}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-[1.6cqw]">
          {PACKS.map((pack, i) => {
            const appear = easeOutCubic(range(local, 0.5 + i * 0.1, 0.9 + i * 0.1))
            return (
              <div
                key={pack.gems}
                className={cn(
                  'flex flex-col items-center gap-[0.8cqw] rounded-[1.8cqw] border py-[2.2cqw] transition-colors duration-200',
                  selected === i ? 'border-primary bg-primary/15' : 'border-border bg-background/60',
                )}
                style={{ opacity: appear, transform: `translate3d(0, ${(1 - appear) * 20}%, 0)` }}
              >
                <Gem className="size-[4cqw] text-primary" aria-hidden="true" />
                <span className="text-[2.8cqw] font-bold">{pack.gems}</span>
                <span className="text-[2cqw] text-muted-foreground">{`${pack.price} د.ج`}</span>
              </div>
            )
          })}
        </div>

        <div
          className="mt-[1cqw] rounded-full bg-primary py-[2cqw] text-center text-[2.8cqw] font-bold text-primary-foreground transition-transform duration-150"
          style={{ transform: `scale(${pressed ? 0.93 : 1})`, opacity: easeOutCubic(range(local, 0.9, 1.2)) }}
        >
          {'شحن الآن'}
        </div>
      </div>

      {confirmFade > 0 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-[2.4cqw] bg-card"
          style={{ opacity: confirmFade }}
        >
          <span
            className="flex size-[13cqw] items-center justify-center rounded-full bg-primary text-primary-foreground"
            style={{ transform: `scale(${confirm})` }}
          >
            <Check className="size-[7cqw]" strokeWidth={3} aria-hidden="true" />
          </span>
          <span className="text-[3.4cqw] font-bold">{'تم الشحن بنجاح'}</span>
          <span dir="ltr" className="flex items-center gap-[1cqw] text-[2.6cqw] text-muted-foreground">
            <Gem className="size-[2.8cqw] text-primary" aria-hidden="true" />
            +520
          </span>
        </div>
      )}
    </ScreenFrame>
  )
}

export function FlexiScreen({ local }: { local: number }) {
  const bars = Math.min(4, Math.floor(range(local, 0.3, 1.2) * 5))
  const data = easeOutCubic(range(local, 0.6, 1.8))
  const balance = Math.round(1000 * easeOutCubic(range(local, 0.8, 1.8)))
  const toast = easeOutBack(range(local, 1.9, 2.3))
  const radius = 42
  const circumference = 2 * Math.PI * radius

  return (
    <ScreenFrame on={1}>
      <StatusBar bars={bars} />
      <div className="flex flex-col gap-[2.6cqw] px-[3cqw] pt-[1.5cqw]">
        <div className="flex items-center justify-between">
          <span className="text-[3cqw] font-bold">{'تعبئة فليكسي'}</span>
          <span className="rounded-[1cqw] bg-primary px-[1.4cqw] py-[0.4cqw] text-[2.2cqw] font-bold text-primary-foreground">
            4G
          </span>
        </div>

        <div className="relative mx-auto size-[24cqw]">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--border)" strokeWidth="7" />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - data * 0.82)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span dir="ltr" className="text-[4.4cqw] font-bold leading-none">{`${Math.round(20 * data)} GB`}</span>
            <span className="text-[2.2cqw] text-muted-foreground">{'إنترنت'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[1.8cqw] border border-border bg-background/60 px-[2.4cqw] py-[2cqw]">
          <span className="text-[2.4cqw] text-muted-foreground">{'الرصيد'}</span>
          <span className="text-[3cqw] font-bold">{`${balance} د.ج`}</span>
        </div>
      </div>

      {toast > 0 && (
        <div
          className="absolute inset-x-[2cqw] top-[7cqw] flex items-center gap-[1.8cqw] rounded-[2cqw] border border-border bg-background px-[2.4cqw] py-[2cqw] shadow-lg"
          style={{ transform: `translate3d(0, ${(1 - toast) * -140}%, 0)`, opacity: Math.min(1, toast * 1.5) }}
        >
          <span className="flex size-[5cqw] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-[3cqw]" strokeWidth={3} aria-hidden="true" />
          </span>
          <span className="text-[2.6cqw] font-bold">{'تمت التعبئة بنجاح'}</span>
        </div>
      )}
    </ScreenFrame>
  )
}
