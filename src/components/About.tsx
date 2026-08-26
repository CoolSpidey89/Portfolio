'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

type TermCommand = { id: string, cmd: string, output: React.ReactNode[] }

const K = { dim: '#475569', mut: '#94a3b8', text: '#e2e8f0', v: '#a78bfa', c: '#06b6d4', g: '#34d399', a: '#fbbf24', p: '#f472b6' }

const commands: TermCommand[] = [
  {
    id: 'whoami', cmd: 'whoami',
    output: [
      <span key="0" style={{ color: K.text }}>om-parida</span>,
      <span key="1"><span style={{ color: K.dim }}>role   : </span><span style={{ color: K.g }}>full-stack developer</span></span>,
      <span key="2"><span style={{ color: K.dim }}>status : </span><span style={{ color: K.g }}>online</span></span>,
    ],
  },
  {
    id: 'skills', cmd: 'cat skills.txt',
    output: [
      <span key="0"><span style={{ color: K.dim }}>frontend  : </span><span style={{ color: K.v }}>react, next.js, tailwind, framer-motion</span></span>,
      <span key="1"><span style={{ color: K.dim }}>backend   : </span><span style={{ color: K.c }}>node.js, django, rest apis</span></span>,
      <span key="2"><span style={{ color: K.dim }}>ml_data   : </span><span style={{ color: K.p }}>python, pandas, numpy</span></span>,
    ],
  },
  {
    id: 'focus', cmd: 'cat focus.md',
    output: [
      <span key="0" style={{ color: K.v }}># currently exploring</span>,
      <span key="1" style={{ color: K.mut }}>- advanced machine learning</span>,
      <span key="2" style={{ color: K.mut }}>- mern stack</span>,
      <span key="3" style={{ color: K.mut }}>- power bi</span>,
    ],
  },
  {
    id: 'log', cmd: 'git log --oneline -3',
    output: [
      <span key="0"><span style={{ color: K.a }}>a3f9c2e</span> <span style={{ color: K.c }}>build:</span> <span style={{ color: K.mut }}>portfolio v2 — space warp intro</span></span>,
      <span key="1"><span style={{ color: K.a }}>7d1e410</span> <span style={{ color: K.v }}>feat:</span> <span style={{ color: K.mut }}>shipped 4+ projects</span></span>,
      <span key="2"><span style={{ color: K.a }}>c88b120</span> <span style={{ color: K.p }}>win:</span> <span style={{ color: K.mut }}>3 hackathons, 7 case comps</span></span>,
    ],
  },
]

function BlinkCursor() {
  const [on, setOn] = useState(true)
  useEffect(() => {
    const id = setInterval(() => setOn(o => !o), 530)
    return () => clearInterval(id)
  }, [])
  return <span style={{ display: 'inline-block', width: '7px', height: '0.95em', background: '#a78bfa', marginLeft: '3px', opacity: on ? 1 : 0, verticalAlign: 'text-bottom' }} />
}

function Terminal({ inView }: { inView: boolean }) {
  const [history,   setHistory]   = useState<TermCommand[]>([])
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [typedCmd,  setTypedCmd]  = useState('')
  const [lineCount, setLineCount] = useState(0)
  const bodyRef  = useRef<HTMLDivElement>(null)
  const timers   = useRef<ReturnType<typeof setTimeout>[]>([])
  const started  = useRef(false)

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const after = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)) }

  const runCommand = (idx: number) => {
    clearTimers()
    const { cmd, output } = commands[idx]
    setActiveIdx(idx)
    setTypedCmd('')
    setLineCount(0)

    let ci = 0
    const typeStep = () => {
      if (ci <= cmd.length) {
        setTypedCmd(cmd.slice(0, ci++))
        after(typeStep, 22)
      } else {
        after(() => printLine(0), 260)
      }
    }
    const printLine = (li: number) => {
      if (li < output.length) {
        setLineCount(li + 1)
        after(() => printLine(li + 1), 140)
      } else {
        after(() => {
          setHistory(h => [...h, commands[idx]])
          setActiveIdx(null)
          after(() => runCommand((idx + 1) % commands.length), 5000)
        }, 500)
      }
    }
    typeStep()
  }

  useEffect(() => {
    if (inView && !started.current) { started.current = true; runCommand(0) }
    return clearTimers
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [history, typedCmd, lineCount])

  const active = activeIdx !== null ? commands[activeIdx] : null
  const cmdDone = active ? typedCmd.length === active.cmd.length : false

  return (
    <div style={{ position: 'relative' }}>
      {/* ambient pulse behind the window — keeps it alive even at idle */}
      <motion.div
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: '-40px', background: 'radial-gradient(ellipse at 50% 40%, rgba(124,58,237,0.14), transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }}
      />

      <div style={{ position: 'relative', background: '#080d1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.015)' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', opacity: 0.8 }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', opacity: 0.8 }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', opacity: 0.8 }} />
          <span style={{ marginLeft: '0.75rem', fontSize: '0.68rem', color: '#334155', fontFamily: 'monospace' }}>om@portfolio: ~</span>
        </div>
        <div ref={bodyRef} style={{ padding: '1.1rem 1.25rem 1.5rem', fontFamily: '"Fira Code", monospace', fontSize: '0.72rem', lineHeight: 1.9, height: '420px', overflowY: 'auto', overflowX: 'hidden' }}>
          {history.map((entry, hi) => (
            <div key={hi} style={{ marginBottom: '1rem' }}>
              <div><span style={{ color: '#a78bfa' }}>$ </span><span style={{ color: K.text }}>{entry.cmd}</span></div>
              {entry.output.map((line, li) => <div key={li}>{line}</div>)}
            </div>
          ))}

          {active && (
            <div>
              <div>
                <span style={{ color: '#a78bfa' }}>$ </span><span style={{ color: K.text }}>{typedCmd}</span>
                {!cmdDone && <BlinkCursor />}
              </div>
              {active.output.slice(0, lineCount).map((line, li) => <div key={li}>{line}</div>)}
              {cmdDone && lineCount >= active.output.length && <BlinkCursor />}
            </div>
          )}

          {!active && history.length > 0 && (
            <div><span style={{ color: '#a78bfa' }}>$ </span><BlinkCursor /></div>
          )}
        </div>
      </div>
    </div>
  )
}

function CountUp({ value, inView, delay = 0, duration = 1.2 }: { value: string, inView: boolean, delay?: number, duration?: number }) {
  const match  = value.match(/^(\d+)(\+?)$/)
  const target = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : ''
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const startTimer = setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / (duration * 1000), 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(eased * target))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay * 1000)
    return () => clearTimeout(startTimer)
  }, [inView, target, duration, delay])

  return <>{display}{suffix}</>
}

const stats = [
  { value: '8',   label: 'Hackathons',     color: '#f472b6' },
  { value: '7+',  label: 'Projects',       color: '#a78bfa' },
  { value: '12',  label: 'Case Comps',     color: '#fbbf24' },
  { value: '10+', label: 'Competitions',   color: '#34d399' },
  { value: '2',   label: 'Summer of Code', color: '#06b6d4' },
]

const exploring = [
  { label: 'Advanced ML', color: '#a78bfa' },
  { label: 'MERN Stack',  color: '#06b6d4' },
  { label: 'Power BI',    color: '#fbbf24' },
]

export default function About() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <>
      <style>{`
        .about-grid { grid-template-columns: 1fr 1.4fr !important; }
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .about-section { padding: 5rem 0 !important; }
          .about-wrap { padding: 0 1.5rem !important; }
        }
      `}</style>

      <section id="about" ref={ref} className="about-section" style={{ position: 'relative', padding: '8rem 0', background: '#04040f', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '30%', left: '10%', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div className="about-wrap" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 4rem' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.22,1,0.36,1] as const }} style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.02em', lineHeight: 1, color: '#fff', marginBottom: '1rem' }}>
              About <span style={{ background: 'linear-gradient(135deg, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Me</span>
            </h2>
            <div style={{ width: '48px', height: '2px', background: 'linear-gradient(90deg, #7c3aed, transparent)', borderRadius: '2px' }} />
          </motion.div>

          <div className="about-grid" style={{ display: 'grid', gap: '3rem', alignItems: 'start' }}>
            {/* LEFT */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2.25rem', paddingLeft: '1.4rem' }}>
              {/* faint background watermark — fills the empty space with texture, not content */}
              <div aria-hidden style={{ position: 'absolute', top: '-4rem', left: '-1.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16rem', lineHeight: 1, color: '#ffffff', opacity: 0.025, pointerEvents: 'none', userSelect: 'none', zIndex: -1 }}>{'{ }'}</div>

              {/* connecting spine — threads all the groups into one piece */}
              <div style={{ position: 'absolute', left: 0, top: '0.4rem', bottom: '0.4rem', width: '1.5px', background: 'linear-gradient(180deg, rgba(167,139,250,0.5), rgba(6,182,212,0.35) 55%, transparent 100%)' }} />

              {/* live status line */}
              <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <motion.span
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }}
                />
                <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.72rem', letterSpacing: '0.05em', color: '#64748b' }}>currently_online.exe</span>
              </motion.div>

              {/* bold statement — replaces the tab/card system */}
              <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1, ease: [0.22,1,0.36,1] as const }}
                style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(1.35rem, 2.3vw, 1.85rem)', lineHeight: 1.5, color: '#e2e8f0', letterSpacing: '-0.01em' }}>
                I build <span style={{ color: '#a78bfa', fontWeight: 600 }}>immersive web experiences</span> and dive into <span style={{ color: '#06b6d4', fontWeight: 600 }}>AI</span> and <span style={{ color: '#f472b6', fontWeight: 600 }}>Machine Learning</span> — currently a CS undergrad turning ideas into interfaces that feel alive, not templated.
              </motion.p>

              {/* numbers — a calm inline stat strip, not pills */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }}
                style={{ display: 'flex', flexWrap: 'wrap', columnGap: '1.75rem', rowGap: '0.5rem' }}>
                {stats.map((stat, i) => (
                  <div key={stat.label} style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: stat.color, fontVariantNumeric: 'tabular-nums' }}>
                      <CountUp value={stat.value} inView={inView} delay={0.3 + i * 0.12} />
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* education — a single confident line, no icon box */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.38 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Education</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                  B.Sc (Hons) Computer Science <span style={{ color: '#334155' }}>·</span> <span style={{ color: '#06b6d4' }}>SSCBS, University of Delhi</span> <span style={{ color: '#334155' }}>·</span> <span style={{ color: '#34d399', fontWeight: 600 }}>CGPA 8.68</span> <span style={{ color: '#475569', fontWeight: 400 }}>(Till 2nd Semester)</span>
                </div>
              </motion.div>

              {/* currently exploring — mirrors the code block's learningNext, ties the two columns together */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.46 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Currently Exploring</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                  {exploring.map((item, i) => (
                    <span key={item.label}>
                      <span style={{ color: item.color, fontWeight: 600 }}>{item.label}</span>
                      {i < exploring.length - 1 ? <span style={{ color: '#334155' }}> · </span> : null}
                    </span>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* RIGHT */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.25, ease: [0.22,1,0.36,1] as const }}>
              <Terminal inView={inView} />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
