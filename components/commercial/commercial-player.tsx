'use client'

import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SoundEngine } from '@/lib/commercial/sound'
import { DURATION, formatTime } from '@/lib/commercial/timeline'
import { Stage } from './stage'

type Status = 'idle' | 'playing' | 'paused' | 'ended'

const POSTER_TIME = 2.8

export function CommercialPlayer() {
  const [time, setTime] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [muted, setMuted] = useState(false)
  const timeRef = useRef(0)
  const soundRef = useRef<SoundEngine | null>(null)

  useEffect(() => {
    if (status !== 'playing') return
    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const prev = timeRef.current
      const next = Math.min(DURATION, prev + dt)
      soundRef.current?.playCuesBetween(prev, next)
      timeRef.current = next
      setTime(next)
      if (next >= DURATION) {
        setStatus('ended')
        return
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [status])

  function getSound() {
    if (!soundRef.current) soundRef.current = new SoundEngine()
    soundRef.current.setMuted(muted)
    soundRef.current.ensure()
    return soundRef.current
  }

  function seek(value: number) {
    timeRef.current = value
    setTime(value)
  }

  function play() {
    getSound()
    if (status === 'ended') seek(0)
    setStatus('playing')
  }

  function pause() {
    soundRef.current?.suspend()
    setStatus('paused')
  }

  function replay() {
    getSound()
    seek(0)
    setStatus('playing')
  }

  function toggleMute() {
    const next = !muted
    setMuted(next)
    soundRef.current?.setMuted(next)
  }

  const isPlaying = status === 'playing'

  return (
    <div className="flex w-full flex-col gap-4" style={{ width: 'min(100%, calc((100dvh - 7rem) * 1.7778))' }}>
      <div className="relative">
        <Stage time={status === 'idle' ? POSTER_TIME : time} />

        {(status === 'idle' || status === 'ended') && (
          <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-background/60 backdrop-blur-[2px]">
            <button
              type="button"
              onClick={status === 'idle' ? play : replay}
              className="flex items-center gap-3 rounded-full bg-primary px-6 py-3 font-sans text-base font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {status === 'idle' ? (
                <Play className="size-5 fill-current" aria-hidden="true" />
              ) : (
                <RotateCcw className="size-5" aria-hidden="true" />
              )}
              {status === 'idle' ? 'تشغيل الإعلان' : 'إعادة التشغيل'}
            </button>
          </div>
        )}
      </div>

      <div dir="ltr" className="flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={isPlaying ? pause : play}
          aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          className="rounded-full"
        >
          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
        </Button>
        <Button size="icon" variant="ghost" onClick={replay} aria-label="إعادة من البداية" className="rounded-full">
          <RotateCcw className="size-4" />
        </Button>

        <input
          type="range"
          min={0}
          max={DURATION}
          step={0.01}
          value={time}
          onChange={(e) => {
            seek(Number(e.target.value))
            if (status === 'idle' || status === 'ended') setStatus('paused')
          }}
          aria-label="موضع التشغيل"
          className="h-1 flex-1 cursor-pointer accent-primary"
        />

        <span dir="ltr" className="w-20 text-center font-sans text-sm tabular-nums text-muted-foreground">
          {`${formatTime(time)} / ${formatTime(DURATION)}`}
        </span>

        <Button
          size="icon"
          variant="ghost"
          onClick={toggleMute}
          aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
          aria-pressed={muted}
          className="rounded-full"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </Button>
      </div>
    </div>
  )
}
