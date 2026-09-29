import type { CSSProperties } from 'react'
import {
  SCENES,
  TRANSITION,
  easeInOutCubic,
  range,
  type EnterType,
  type SceneId,
} from '@/lib/commercial/timeline'
import { StartechLogo } from './logo'
import { FinaleScene } from './scenes/finale-scene'
import { IntroScene } from './scenes/intro-scene'
import { FlexiScreen, GameTopUpScreen } from './scenes/phone-screens'
import { PrinterTasks } from './scenes/printer-tasks'
import { ServiceScene } from './scenes/service-scene'

function sceneStyle(enter: EnterType, p: number, exit: EnterType | undefined, q: number): CSSProperties {
  let x = 0
  let scale = 1
  let opacity = 1

  if (enter === 'fade') {
    opacity = p
    scale = 1 + 0.04 * (1 - p)
  } else if (enter === 'zoom') {
    opacity = p
    scale = 1 + 0.12 * (1 - p)
  } else if (enter === 'push') {
    x = (1 - p) * 100
  } else if (enter === 'crossfade') {
    opacity = p
  }

  if (exit === 'push') x -= q * 100
  if (exit === 'zoom') scale *= 1 - 0.06 * q

  return { opacity, transform: `translate3d(${x}%, 0, 0) scale(${scale})` }
}

function renderScene(id: SceneId, local: number, duration: number, t: number) {
  const phoneScale = 1.06 - 0.05 * easeInOutCubic(range(t, 19.5, 26.2))

  switch (id) {
    case 'intro':
      return <IntroScene local={local} />
    case 'computer':
      return (
        <ServiceScene
          local={local}
          duration={duration}
          image="/scenes/wide/computer.png"
          alt="حاسوب محمول وحاسوب مكتبي مع ذاكرة وقرص SSD ولوحة مفاتيح وفأرة"
          title="صيانة الحواسيب"
          subtitle={['تشخيص', 'إصلاح', 'تحسين']}
        />
      )
    case 'phone':
      return (
        <ServiceScene
          local={local}
          duration={duration}
          image="/scenes/wide/phone-accessories.png"
          alt="هاتف ذكي مع أغلفة وشواحن وكوابل وسماعات"
          title="مستلزمات الهواتف"
        />
      )
    case 'it':
      return (
        <ServiceScene
          local={local}
          duration={duration}
          image="/scenes/wide/it-products.png"
          alt="لوحة مفاتيح وفأرة وذواكر USB وكوابل وملحقات شبكات"
          title="منتجات الإعلام الآلي"
        />
      )
    case 'school':
      return (
        <ServiceScene
          local={local}
          duration={duration}
          image="/scenes/wide/school.png"
          alt="دفاتر وأقلام ومساطر وملفات وأدوات مكتبية"
          title="الأدوات المدرسية"
        />
      )
    case 'printer':
      return (
        <ServiceScene
          local={local}
          duration={duration}
          image="/scenes/wide/printer.png"
          alt="طابعة وماسح ضوئي حديث مع أوراق بيضاء"
          title="استخراج وطباعة الوثائق"
          extra={<PrinterTasks local={local} />}
        />
      )
    case 'game':
      return (
        <ServiceScene
          local={local}
          duration={duration}
          image="/scenes/smartphone.png"
          alt="هاتف ذكي يعرض واجهة شحن الألعاب"
          title="شحن الألعاب"
          kenBurnsScale={phoneScale}
          screen={<GameTopUpScreen local={local} />}
          sweep={false}
        />
      )
    case 'flexi':
      return (
        <ServiceScene
          local={local}
          duration={duration}
          image="/scenes/smartphone.png"
          alt="هاتف ذكي يعرض واجهة تعبئة الرصيد والإنترنت"
          title="تعبئة فليكسي • إنترنت"
          kenBurnsScale={phoneScale}
          screen={<FlexiScreen local={local} />}
          sweep={false}
        />
      )
    case 'finale':
      return <FinaleScene local={local} />
  }
}

export function Stage({ time }: { time: number }) {
  const brand = range(time, 3.9, 4.6) * (1 - range(time, 25.2, 25.6))

  return (
    <div className="@container relative aspect-video w-full overflow-hidden rounded-2xl bg-background shadow-2xl ring-1 ring-border">
      {SCENES.map((scene, i) => {
        const next = SCENES[i + 1]
        const visible = time >= scene.start && (next ? time < scene.end + TRANSITION : true)
        if (!visible) return null

        const enterP = easeInOutCubic(range(time, scene.start, scene.start + TRANSITION))
        const exitP = next ? easeInOutCubic(range(time, scene.end, scene.end + TRANSITION)) : 0
        const style =
          scene.enter === 'none' ? {} : sceneStyle(scene.enter, enterP, next?.enter, exitP)
        const exitStyle = scene.enter === 'none' && next ? sceneStyle('none', 1, next.enter, exitP) : {}

        return (
          <div
            key={scene.id}
            className="absolute inset-0 will-change-transform"
            style={{ ...style, ...exitStyle, zIndex: i }}
          >
            {renderScene(scene.id, time - scene.start, scene.end - scene.start, time)}
          </div>
        )
      })}

      {brand > 0 && (
        <div
          aria-hidden="true"
          dir="ltr"
          className="pointer-events-none absolute right-[6cqw] top-[3.4cqw] z-20"
          style={{ opacity: brand }}
        >
          <StartechLogo className="text-[1.7cqw]" />
        </div>
      )}
    </div>
  )
}
