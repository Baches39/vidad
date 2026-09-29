import { CUES, type SoundName } from './timeline'

export class SoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private noise: AudioBuffer | null = null
  private muted = false

  ensure() {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Ctx()
      this.master = this.ctx.createGain()
      this.master.gain.value = this.muted ? 0 : 0.9
      this.master.connect(this.ctx.destination)

      const length = this.ctx.sampleRate * 2
      this.noise = this.ctx.createBuffer(1, length, this.ctx.sampleRate)
      const data = this.noise.getChannelData(0)
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
  }

  suspend() {
    if (this.ctx?.state === 'running') void this.ctx.suspend()
  }

  setMuted(muted: boolean) {
    this.muted = muted
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.9, this.ctx.currentTime, 0.02)
    }
  }

  playCuesBetween(prev: number, next: number) {
    for (const cue of CUES) {
      if (cue.time > prev && cue.time <= next) this.play(cue.sound)
    }
  }

  play(name: SoundName) {
    if (!this.ctx || !this.master || this.muted) return
    switch (name) {
      case 'whoosh':
        return this.whoosh(0.7, 0.32, 350, 2600)
      case 'softWhoosh':
        return this.whoosh(0.9, 0.16, 250, 1400)
      case 'click':
        return this.click()
      case 'impact':
        return this.impact()
      case 'notify':
        return this.notify()
      case 'printer':
        return this.printer(1.7)
      case 'chime':
        return this.chime()
    }
  }

  private noiseSource(loop = false) {
    const src = this.ctx!.createBufferSource()
    src.buffer = this.noise
    src.loop = loop
    return src
  }

  private whoosh(duration: number, peak: number, from: number, to: number) {
    const ctx = this.ctx!
    const now = ctx.currentTime
    const src = this.noiseSource()
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 1.1
    filter.frequency.setValueAtTime(from, now)
    filter.frequency.exponentialRampToValueAtTime(to, now + duration * 0.55)
    filter.frequency.exponentialRampToValueAtTime(from * 1.4, now + duration)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(peak, now + duration * 0.45)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    src.connect(filter).connect(gain).connect(this.master!)
    src.start(now)
    src.stop(now + duration + 0.05)
  }

  private click() {
    const ctx = this.ctx!
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1900, now)
    osc.frequency.exponentialRampToValueAtTime(850, now + 0.04)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.14, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06)
    osc.connect(gain).connect(this.master!)
    osc.start(now)
    osc.stop(now + 0.08)

    const tick = this.noiseSource()
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 4000
    const tickGain = ctx.createGain()
    tickGain.gain.setValueAtTime(0.07, now)
    tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025)
    tick.connect(hp).connect(tickGain).connect(this.master!)
    tick.start(now)
    tick.stop(now + 0.04)
  }

  private impact() {
    const ctx = this.ctx!
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(115, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.6)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.5, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1)
    osc.connect(gain).connect(this.master!)
    osc.start(now)
    osc.stop(now + 1.05)

    const air = this.noiseSource()
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 900
    const airGain = ctx.createGain()
    airGain.gain.setValueAtTime(0.12, now)
    airGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4)
    air.connect(lp).connect(airGain).connect(this.master!)
    air.start(now)
    air.stop(now + 0.45)
  }

  private notify() {
    const ctx = this.ctx!
    const now = ctx.currentTime
    const tones = [1046.5, 1568]
    tones.forEach((freq, i) => {
      const start = now + i * 0.11
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.16, start + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4)
      osc.connect(gain).connect(this.master!)
      osc.start(start)
      osc.stop(start + 0.45)
    })
  }

  private printer(duration: number) {
    const ctx = this.ctx!
    const now = ctx.currentTime
    const envelope = ctx.createGain()
    envelope.gain.setValueAtTime(0.0001, now)
    envelope.gain.exponentialRampToValueAtTime(1, now + 0.12)
    envelope.gain.setValueAtTime(1, now + duration - 0.2)
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    envelope.connect(this.master!)

    const src = this.noiseSource(true)
    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 1500
    band.Q.value = 0.8
    const rhythm = ctx.createGain()
    rhythm.gain.value = 0.06
    const lfo = ctx.createOscillator()
    lfo.type = 'square'
    lfo.frequency.value = 13
    const lfoDepth = ctx.createGain()
    lfoDepth.gain.value = 0.045
    lfo.connect(lfoDepth).connect(rhythm.gain)
    src.connect(band).connect(rhythm).connect(envelope)

    const motor = ctx.createOscillator()
    motor.type = 'sawtooth'
    motor.frequency.value = 92
    const motorFilter = ctx.createBiquadFilter()
    motorFilter.type = 'lowpass'
    motorFilter.frequency.value = 380
    const motorGain = ctx.createGain()
    motorGain.gain.value = 0.05
    motor.connect(motorFilter).connect(motorGain).connect(envelope)

    ;[src, lfo, motor].forEach((node) => {
      node.start(now)
      node.stop(now + duration + 0.05)
    })
  }

  private chime() {
    const ctx = this.ctx!
    const now = ctx.currentTime
    ;[784, 1174.7].forEach((freq, i) => {
      const start = now + i * 0.06
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.09, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.4)
      osc.connect(gain).connect(this.master!)
      osc.start(start)
      osc.stop(start + 1.45)
    })
  }
}
