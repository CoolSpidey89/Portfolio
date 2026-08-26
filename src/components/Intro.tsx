'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const BOOT_LINES = [
  'booting portfolio_os v2.0',
  'mounting /dev/creativity',
  'loading three.js ................ OK',
  'compiling components ............ OK',
  'establishing uplink ............. OK',
]

const WORDS = ['OM', 'PARIDA']
const GLYPHS = '!<>-_\\/[]{}=+*^?#$%&01'
const RING_COUNT   = 4
const STREAK_COUNT = 20
const STREAK_COLORS = ['#a78bfa', '#06b6d4', '#f472b6', '#fbbf24', '#ffffff']

function Word({ mode }: { mode: 'base' | 'ghost' }) {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {WORDS.map((word, wi) => (
        <div key={word} style={{ display: 'flex' }}>
          {word.split('').map((ch, i) => (
            <span
              key={i}
              className={mode === 'base' ? 'scramble-letter' : undefined}
              data-final={ch}
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(2.6rem, 8vw, 5.5rem)',
                lineHeight: 1,
                letterSpacing: '-0.01em',
                color: wi === 1 && mode === 'base' ? undefined : mode === 'base' ? '#ffffff' : undefined,
                background: wi === 1 && mode === 'base' ? 'linear-gradient(135deg, #a78bfa, #06b6d4)' : undefined,
                WebkitBackgroundClip: wi === 1 && mode === 'base' ? 'text' : undefined,
                WebkitTextFillColor: wi === 1 && mode === 'base' ? 'transparent' : undefined,
                backgroundClip: wi === 1 && mode === 'base' ? 'text' : undefined,
              }}
            >{ch}</span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function Intro() {
  const [visible, setVisible] = useState(true)

  const containerRef  = useRef<HTMLDivElement>(null)
  const stageRef       = useRef<HTMLDivElement>(null)
  const flashRef        = useRef<HTMLDivElement>(null)
  const bloomRef        = useRef<HTMLDivElement>(null)
  const vignetteRef    = useRef<HTMLDivElement>(null)
  const termRef          = useRef<HTMLDivElement>(null)
  const nameWrapRef   = useRef<HTMLDivElement>(null)
  const ghostRedRef   = useRef<HTMLDivElement>(null)
  const ghostCyanRef = useRef<HTMLDivElement>(null)
  const labelRef        = useRef<HTMLDivElement>(null)
  const hintRef           = useRef<HTMLDivElement>(null)
  const coreRef          = useRef<HTMLDivElement>(null)
  const vortexRef       = useRef<HTMLDivElement>(null)

  const tlRef   = useRef<gsap.core.Timeline | null>(null)
  const timers  = useRef<ReturnType<typeof setTimeout>[]>([])
  const done    = useRef(false)

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const finish = () => {
    if (done.current) return
    done.current = true
    clearTimers()
    document.body.style.overflow = ''
    setVisible(false)
  }

  const scrambleLetter = (el: HTMLElement, delayMs: number) => {
    const final = el.dataset.final ?? ''
    if (final === ' ') return
    const cycles = 6
    let i = 0
    const t = setTimeout(() => {
      const id = setInterval(() => {
        el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        i++
        if (i >= cycles) { clearInterval(id); el.textContent = final }
      }, 42)
      timers.current.push(id as unknown as ReturnType<typeof setTimeout>)
    }, delayMs)
    timers.current.push(t)
  }

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) { finish(); return }

    document.body.style.overflow = 'hidden'

    const lines    = gsap.utils.toArray<HTMLElement>('.boot-line')
    const letters  = gsap.utils.toArray<HTMLElement>('.scramble-letter')
    const ringsEl  = gsap.utils.toArray<HTMLElement>('.intro-ring')
    const streaksA = gsap.utils.toArray<HTMLElement>('.intro-streak[data-group="a"]')
    const streaksB = gsap.utils.toArray<HTMLElement>('.intro-streak[data-group="b"]')

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: finish })
    tlRef.current = tl

    // ── boot log ──
    tl.fromTo(lines, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.26, stagger: 0.1 }, 0)

    // ── smooth decaying glitch shake (no strobe) ──
    const shakeSteps = [
      { x: -9,  y: 5,  skew: 2.5,  hue: 22  },
      { x: 7,   y: -5, skew: -2.5, hue: -18 },
      { x: -5,  y: 3,  skew: 1.5,  hue: 12  },
      { x: 3,   y: -2, skew: -1,   hue: -6  },
      { x: 0,   y: 0,  skew: 0,    hue: 0   },
    ]
    let shakeT = 0.72
    shakeSteps.forEach(s => {
      tl.to(stageRef.current, { x: s.x, y: s.y, skewX: s.skew, filter: `hue-rotate(${s.hue}deg)`, duration: 0.06, ease: 'power1.inOut' }, shakeT)
      shakeT += 0.06
    })
    tl.to(flashRef.current, { opacity: 0.35, duration: 0.07 }, 0.72)
      .to(flashRef.current, { opacity: 0, duration: 0.18 }, 0.79)
      .to(lines, { opacity: 0, x: 18, duration: 0.24, stagger: 0.02, ease: 'power2.in' }, 0.72)

      // ── name decode ──
      .to(ghostRedRef.current,  { opacity: 0.75, x: -14, duration: 0.01 }, 0.98)
      .to(ghostCyanRef.current, { opacity: 0.75, x: 14,  duration: 0.01 }, 0.98)
      .call(() => { letters.forEach((el, i) => scrambleLetter(el, i * 35)) }, [], 0.98)
      .to(ghostRedRef.current,  { opacity: 0, x: 0, duration: 0.6, ease: 'power3.out' }, 1.02)
      .to(ghostCyanRef.current, { opacity: 0, x: 0, duration: 0.6, ease: 'power3.out' }, 1.02)
      .fromTo(nameWrapRef.current, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.45 }, 0.98)

      // ── tagline ──
      .fromTo(labelRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 1.62)

      // ── hold ──
      .to({}, { duration: 0.35 }, 2.05)

      // ── charge-up: the portal wakes up ──
      .fromTo(vortexRef.current, { scale: 0.25, opacity: 0, rotate: 0 }, { scale: 1, opacity: 0.9, rotate: 70, duration: 0.5, ease: 'power2.out' }, 2.35)
      .fromTo(coreRef.current,   { scale: 0.3,  opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }, 2.35)
      .to(vignetteRef.current, { opacity: 0.75, duration: 0.5 }, 2.35)
      .to([nameWrapRef.current, labelRef.current], { scale: 0.96, duration: 0.4, ease: 'power2.inOut' }, 2.35)

      // ── launch: text peels away, first wave of streaks fires, portal flares ──
      .to(bloomRef.current, { opacity: 0.45, duration: 0.18, ease: 'power1.out' }, 2.85)
      .to(bloomRef.current, { opacity: 0.15, duration: 0.5, ease: 'power2.out' }, 3.03)
      .fromTo(streaksA, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 0.9, duration: 0.4, stagger: 0.012, ease: 'power4.out' }, 2.85)
      .to([nameWrapRef.current, labelRef.current, hintRef.current], { opacity: 0, scale: 1.15, filter: 'blur(6px)', duration: 0.5, ease: 'power2.in' }, 2.85)

      // ── rift rings rolling outward, one after another ──
      .call(() => {
        ringsEl.forEach((ring, i) => {
          gsap.fromTo(ring, { scale: 0.2, opacity: 0.8 }, {
            scale: 3.2 + i * 0.55, opacity: 0, duration: 1.15, ease: 'power2.out',
            delay: i * 0.16,
          })
        })
      }, [], 2.85)

      // ── streak wave B — sustained travel through the tunnel ──
      .fromTo(streaksB, { scaleY: 0, opacity: 0 }, { scaleY: 1.25, opacity: 0.8, duration: 0.45, stagger: 0.012, ease: 'power4.out' }, 3.2)

      // ── portal keeps spinning and swelling while we fall toward it ──
      .to(vortexRef.current, { scale: 5, rotate: 340, opacity: 0.5, duration: 1.7, ease: 'power2.in' }, 2.95)
      .to(coreRef.current,   { scale: 6.5, opacity: 0, duration: 1.7, ease: 'power2.in' }, 2.95)

      // ── the long accelerating plunge ──
      .to(containerRef.current, { scale: 5.5, filter: 'blur(20px)', duration: 1.6, ease: 'power2.in' }, 2.95)

      // ── streaks fade as we near the core ──
      .to([streaksA, streaksB], { opacity: 0, duration: 0.4, ease: 'power2.in' }, 4.2)

      // ── arrival: one last warm bloom, then a smooth cross-fade into the site ──
      .to(bloomRef.current, { opacity: 0.5, duration: 0.25, ease: 'power1.out' }, 4.25)
      .to(containerRef.current, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, 4.3)
      .to(bloomRef.current, { opacity: 0, duration: 0.4 }, 4.55)

    return () => clearTimers()
  }, { scope: containerRef })

  const handleSkip = () => {
    if (done.current) return
    tlRef.current?.kill()
    clearTimers()
    gsap.set(stageRef.current, { x: 0, y: 0, skewX: 0, filter: 'none' })
    gsap.to([nameWrapRef.current, labelRef.current, hintRef.current, termRef.current],
      { opacity: 0, scale: 1.1, filter: 'blur(6px)', duration: 0.3, ease: 'power2.in' })
    gsap.to(bloomRef.current, { opacity: 0.4, duration: 0.15, delay: 0.1 })
    gsap.to(containerRef.current, {
      scale: 2.6, filter: 'blur(16px)', opacity: 0, duration: 0.5, ease: 'power4.in', delay: 0.15,
      onComplete: finish,
    })
  }

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      onClick={handleSkip}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: '#04040f',
        overflow: 'hidden',
        cursor: 'none',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 50%, rgba(124,58,237,0.2), transparent 60%)' }} />

      {/* ── spiral vortex ── */}
      <div ref={vortexRef} style={{
        position: 'absolute', top: '50%', left: '50%', width: '520px', height: '520px',
        transform: 'translate(-50%, -50%) scale(0.25) rotate(0deg)', opacity: 0,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'conic-gradient(from 0deg, rgba(4,4,15,0.95), rgba(167,139,250,0.55) 12%, rgba(4,4,15,0.9) 28%, rgba(6,182,212,0.5) 42%, rgba(4,4,15,0.92) 58%, rgba(244,114,182,0.4) 72%, rgba(4,4,15,0.92) 86%, rgba(167,139,250,0.5) 100%)',
        filter: 'blur(10px)',
      }} />

      {/* ── rift rings ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {Array.from({ length: RING_COUNT }).map((_, i) => (
          <div key={i} className="intro-ring" style={{
            position: 'absolute', top: '50%', left: '50%',
            width: '260px', height: '260px',
            borderRadius: '50%',
            border: `1.5px solid ${i % 2 === 0 ? 'rgba(167,139,250,0.7)' : 'rgba(6,182,212,0.7)'}`,
            boxShadow: `0 0 30px ${i % 2 === 0 ? 'rgba(167,139,250,0.4)' : 'rgba(6,182,212,0.4)'}`,
            transform: 'translate(-50%, -50%) scale(0.2)',
            opacity: 0,
          }} />
        ))}
      </div>

      {/* ── warp streaks ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {Array.from({ length: STREAK_COUNT }).map((_, i) => {
          const angle = (360 / STREAK_COUNT) * i
          const group = i % 2 === 0 ? 'a' : 'b'
          const color = STREAK_COLORS[i % STREAK_COLORS.length]
          const length = 46 + (i % 5) * 7
          return (
            <div key={i} className="intro-streak" data-group={group} style={{
              position: 'absolute', top: '50%', left: '50%',
              width: '2px', height: `${length}vh`,
              background: `linear-gradient(to top, transparent, ${color}, transparent)`,
              transformOrigin: 'center',
              transform: `translate(-50%, -50%) rotate(${angle}deg) scaleY(0)`,
              opacity: 0,
            }} />
          )
        })}
      </div>

      {/* ── warm galaxy-core glow ── */}
      <div ref={coreRef} style={{
        position: 'absolute', top: '50%', left: '50%', width: '150px', height: '150px',
        transform: 'translate(-50%, -50%) scale(0.3)', opacity: 0,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(255,251,235,0.95) 0%, rgba(255,244,214,0.75) 18%, rgba(167,139,250,0.55) 45%, rgba(6,182,212,0.28) 65%, transparent 78%)',
        filter: 'blur(3px)',
      }} />

      {/* ── vignette to keep the edges dark like deep space ── */}
      <div ref={vignetteRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0, background: 'radial-gradient(circle at 50% 50%, transparent 25%, rgba(2,2,10,0.92) 100%)' }} />

      <div ref={stageRef} style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

        {/* ── terminal boot log ── */}
        <div ref={termRef} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '280px' }}>
          {BOOT_LINES.map((line, i) => (
            <div key={i} className="boot-line" style={{ opacity: 0, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: '0.78rem', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#a78bfa' }}>{'>'}</span>{' '}
              <span style={{ color: line.includes('OK') ? '#e2e8f0' : '#94a3b8' }}>
                {line.replace('OK', '')}
              </span>
              {line.includes('OK') && <span style={{ color: '#06b6d4' }}>OK</span>}
            </div>
          ))}
        </div>

        {/* ── name decode with chromatic ghosts ── */}
        <div ref={nameWrapRef} style={{ position: 'relative', opacity: 0, marginBottom: '1.75rem' }}>
          <div ref={ghostRedRef}  style={{ position: 'absolute', inset: 0, opacity: 0, color: '#ff2d55', mixBlendMode: 'screen', pointerEvents: 'none' }}><Word mode="ghost" /></div>
          <div ref={ghostCyanRef} style={{ position: 'absolute', inset: 0, opacity: 0, color: '#06b6d4', mixBlendMode: 'screen', pointerEvents: 'none' }}><Word mode="ghost" /></div>
          <Word mode="base" />
        </div>

        <div ref={labelRef} style={{ opacity: 0, fontFamily: 'var(--font-body)', fontSize: '0.68rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#64748b' }}>
          Full-Stack Developer
        </div>
      </div>

      <div ref={hintRef} style={{ position: 'absolute', bottom: '2rem', right: '2rem', fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#334155' }}>
        Click to skip
      </div>

      {/* soft colored glow pulses — never a hard white flash */}
      <div ref={bloomRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0, background: 'radial-gradient(circle at 50% 50%, rgba(255,244,214,0.9) 0%, rgba(167,139,250,0.5) 30%, rgba(6,182,212,0.25) 55%, transparent 75%)' }} />
      <div ref={flashRef} style={{ position: 'absolute', inset: 0, background: '#e9d5ff', opacity: 0, pointerEvents: 'none', mixBlendMode: 'screen' }} />
    </div>
  )
}
