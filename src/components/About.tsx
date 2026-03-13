'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const fullCode = `class Developer {
  constructor() {
    this.name         = "Om Parida";
    this.role         = "Full Stack Developer";
    this.interests    = [
      "Machine Learning",
      "Data Visualization",
      "Frontend Development",
    ];
    this.techStack    = [
      "HTML", "React", "JS", "Python",
    ];
    this.currentFocus = "Develop Tech Skills";
    this.learningNext = [
      "Adv ML", "MERN", "PowerBI",
    ];
  }

  build() {
    return "Turning ideas into" +
      " scalable apps";
  }
}`

function CodeBlock({ inView }: { inView: boolean }) {
  const [displayed, setDisplayed] = useState('')
  const [cursor,    setCursor]    = useState(true)
  const [typing,    setTyping]    = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const indexRef = useRef(0)
  const phaseRef = useRef<'typing' | 'waiting' | 'clearing'>('typing')

  const startTyping = () => {
    setTyping(true)
    setDisplayed('')
    indexRef.current = 0
    const step = () => {
      if (phaseRef.current === 'typing') {
        if (indexRef.current <= fullCode.length) {
          setDisplayed(fullCode.slice(0, indexRef.current++))
          timerRef.current = setTimeout(step, 28)
        } else {
          phaseRef.current = 'waiting'
          timerRef.current = setTimeout(() => {
            phaseRef.current = 'clearing'
            setDisplayed('')
            indexRef.current = 0
            timerRef.current = setTimeout(() => { phaseRef.current = 'typing'; step() }, 300)
          }, 1500)
        }
      }
    }
    timerRef.current = setTimeout(step, 100)
  }

  useEffect(() => {
    if (inView && !typing) startTyping()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  useEffect(() => {
    const blink = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(blink)
  }, [])

  const lines = displayed.split('\n')
  return (
    <div style={{ background: '#080d1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.015)' }}>
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', opacity: 0.8 }} />
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', opacity: 0.8 }} />
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', opacity: 0.8 }} />
        <span style={{ marginLeft: '0.75rem', fontSize: '0.68rem', color: '#334155', fontFamily: 'monospace' }}>developer.js</span>
      </div>
      <div style={{ padding: '1.1rem 1.25rem 1.5rem', fontFamily: '"Fira Code", monospace', fontSize: '0.72rem', lineHeight: 1.9, minHeight: '420px', overflowX: 'auto' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: 'flex', whiteSpace: 'pre' }}>
            <span style={{ color: '#1e3a5f', marginRight: '1rem', userSelect: 'none', minWidth: '1.8rem', textAlign: 'right', fontSize: '0.6rem', flexShrink: 0 }}>{i + 1}</span>
            <span style={{ color: '#94a3b8' }}>{line}</span>
            {i === lines.length - 1 && <span style={{ display: 'inline-block', width: '2px', height: '0.85em', background: '#a78bfa', marginLeft: '1px', opacity: cursor ? 1 : 0, verticalAlign: 'middle' }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

const interests = [
  { emoji: '🎵', title: 'Music',      color: '#a78bfa', glow: 'rgba(167,139,250,0.2)' },
  { emoji: '🏏', title: 'Cricket',    color: '#34d399', glow: 'rgba(52,211,153,0.2)'  },
  { emoji: '🏐', title: 'Volleyball', color: '#06b6d4', glow: 'rgba(6,182,212,0.2)'   },
]

const cards = [
  { id: 'intro',     icon: '👋', label: 'WHO I AM'  },
  { id: 'education', icon: '🎓', label: 'EDUCATION' },
  { id: 'interests', icon: '✨', label: 'INTERESTS' },
]
const cardColors: Record<string, string> = { intro: '#a78bfa', education: '#06b6d4', interests: '#f472b6' }

export default function About() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState('intro')

  const cardContent: Record<string, React.ReactNode> = {
    intro: (
      <motion.p key="intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
        style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.85, color: '#94a3b8' }}>
        Hi, I'm <span style={{ color: '#fff', fontWeight: 600 }}>Om Parida</span> — a full-stack developer obsessed with building immersive web experiences and intelligent applications. Currently looking into{' '}
        <span style={{ color: '#a78bfa' }}>Data Structures</span>,{' '}
        <span style={{ color: '#06b6d4' }}>AI</span> and{' '}
        <span style={{ color: '#f472b6' }}>Machine Learning</span>.
      </motion.p>
    ),
    education: (
      <motion.div key="education" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>🎓</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', color: '#fff', marginBottom: '0.25rem' }}>B.Sc (Hons) Computer Science</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#06b6d4', marginBottom: '0.6rem' }}>Shaheed Sukhdev College of Business Studies, DU</div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', padding: '0.2rem 0.7rem', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>1st Year · Class of '28</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', padding: '0.2rem 0.7rem', borderRadius: '999px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontWeight: 600 }}>GPA: 8.18</span>
          </div>
        </div>
      </motion.div>
    ),
    interests: (
      <motion.div key="interests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
        style={{ display: 'flex', gap: '1rem', justifyContent: 'center', paddingTop: '0.5rem' }}>
        {interests.map((item, i) => (
          <motion.div key={item.title}
            initial={{ opacity: 0, scale: 0.7, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const }}
            whileHover={{ y: -6, scale: 1.05 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', flex: 1, cursor: 'default' }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: `radial-gradient(135deg at 30% 30%, ${item.glow}, rgba(0,0,0,0.3))`, border: `1px solid ${item.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', boxShadow: `0 8px 32px ${item.color}33`, transition: 'all 0.3s' }}>{item.emoji}</div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 500, color: item.color }}>{item.title}</span>
          </motion.div>
        ))}
      </motion.div>
    ),
  }

  const stats = [
    { value: '4+', label: 'Projects Built', color: '#a78bfa' },
    { value: '7',  label: 'Case Comps',     color: '#06b6d4' },
    { value: '3',  label: 'Hackathons',     color: '#34d399' },
    { value: '∞',  label: 'Curiosity',      color: '#f472b6' },
  ]

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.1, ease: [0.22,1,0.36,1] as const }} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {cards.map(card => {
                  const color    = cardColors[card.id]
                  const isActive = active === card.id
                  return (
                    <button key={card.id} onClick={() => setActive(card.id)} style={{ padding: '0.45rem 1rem', borderRadius: '999px', fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.07em', border: `1px solid ${isActive ? color+'77' : 'rgba(255,255,255,0.07)'}`, background: isActive ? `${color}1a` : 'transparent', color: isActive ? color : '#475569', cursor: 'none', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: isActive ? `0 0 16px ${color}22` : 'none' }}>
                      <span>{card.icon}</span>{card.label}
                    </button>
                  )
                })}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2, ease: [0.22,1,0.36,1] as const }}
                style={{ padding: '1.75rem', borderRadius: '14px', border: `1px solid ${cardColors[active]}22`, background: `${cardColors[active]}07`, minHeight: '130px', transition: 'border-color 0.4s, background 0.4s', boxShadow: `0 8px 40px ${cardColors[active]}0d` }}>
                <AnimatePresence mode="wait">{cardContent[active]}</AnimatePresence>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.35, ease: [0.22,1,0.36,1] as const }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {stats.map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }} whileHover={{ y: -3 }}
                    style={{ padding: '1.1rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', cursor: 'default', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${stat.color}44`; el.style.boxShadow = `0 8px 24px ${stat.color}18` }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.05)'; el.style.boxShadow = 'none' }}
                  >
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem', color: stat.color, lineHeight: 1, marginBottom: '0.35rem' }}>{stat.value}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.25, ease: [0.22,1,0.36,1] as const }}>
              <CodeBlock inView={inView} />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
