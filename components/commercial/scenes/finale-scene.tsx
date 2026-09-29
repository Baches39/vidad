import { Gamepad2, Wifi } from 'lucide-react'
import Image from 'next/image'
import { easeInOutCubic, easeOutBack, easeOutCubic, easeOutExpo, range } from '@/lib/commercial/timeline'
import { StartechLogo } from '../logo'
import { Reveal } from '../motion'

const TILES = [
  { src: '/scenes/wide/computer.png', from: [-120, -60] },
  { src: '/scenes/wide/phone-accessories.png', from: [0, -140] },
  { src: '/scenes/wide/it-products.png', from: [120, -60] },
  { src: '/scenes/wide/school.png', from: [-120, 60] },
  { src: '/scenes/wide/printer.png', from: [0, 140] },
  { src: '/scenes/smartphone.png', from: [120, 60] },
]

const SERVICES = [
  'صيانة الحواسيب',
  'مستلزمات الهواتف',
  'منتجات الإعلام الآلي',
  'الأدوات المدرسية',
  'الوثائق والطباعة',
  'شحن الألعاب',
  'فليكسي وإنترنت',
]

export function FinaleScene({ local }: { local: number }) {
  const logo = easeOutCubic(range(local, 0.5, 1.3))
  const tagline = easeOutExpo(range(local, 1.1, 1.8))
  const finish = easeOutBack(range(local, 3.4, 4.1))
  const underline = easeInOutCubic(range(local, 3.4, 4.1))

  return (
    <div className="absolute inset-0 flex items-center justify-between gap-[5cqw] overflow-hidden bg-background px-[6cqw]">
      <div className="flex w-[44%] flex-col items-start gap-[3cqw]">
        <div className="flex flex-col items-start gap-[1.4cqw]">
          <div
            dir="ltr"
            style={{
              opacity: logo,
              transform: `scale(${0.88 + 0.12 * logo + 0.03 * Math.sin(finish * Math.PI)})`,
              transformOrigin: 'right center',
              filter: `blur(${(1 - logo) * 10}px)`,
            }}
          >
            <StartechLogo className="text-[5.2cqw]" markRotation={90 * finish} />
          </div>
          <div
            className="h-px w-[22cqw] origin-right bg-primary"
            style={{ transform: `scaleX(${Math.max(logo * 0.4, underline)})` }}
          />
          <Reveal progress={tagline}>
            <p lang="ar" className="font-sans text-[2.6cqw] font-medium text-foreground/90">
              {'خدمات تقنية متكاملة'}
            </p>
          </Reveal>
        </div>

        <ul lang="ar" className="grid w-full grid-cols-2 gap-x-[2.4cqw] gap-y-[1.3cqw]">
          {SERVICES.map((service, i) => {
            const p = easeOutCubic(range(local, 1.5 + i * 0.1, 2.0 + i * 0.1))
            return (
              <li
                key={service}
                className="flex items-center gap-[0.9cqw] border-b border-border pb-[0.9cqw] font-sans text-[1.6cqw] font-medium text-foreground"
                style={{ opacity: p, transform: `translate3d(0, ${(1 - p) * 40}%, 0)` }}
              >
                <span aria-hidden="true" className="size-[0.6cqw] shrink-0 rounded-full bg-primary" />
                {service}
              </li>
            )
          })}
        </ul>
      </div>

      <div className="grid w-[46%] grid-cols-3 gap-[1.2cqw]">
        {TILES.map((tile, i) => {
          const p = easeOutCubic(range(local, i * 0.06, 1.1 + i * 0.06))
          return (
            <div
              key={tile.src}
              className="relative aspect-[4/5] overflow-hidden rounded-[1cqw] border border-border"
              style={{
                opacity: p,
                transform: `translate3d(${(1 - p) * tile.from[0]}%, ${(1 - p) * tile.from[1]}%, 0) scale(${1.4 - 0.4 * p})`,
              }}
            >
              <Image src={tile.src} alt="" fill sizes="240px" className="object-cover object-[30%_50%]" />
              {tile.src === '/scenes/smartphone.png' && (
                <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center gap-[0.8cqw] text-primary">
                  <Gamepad2 className="size-[2.2cqw]" />
                  <Wifi className="size-[2.2cqw]" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
