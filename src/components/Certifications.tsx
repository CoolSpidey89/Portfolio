'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const certData = {
  'Hackathons & Case Comps': [
    { id: 1, title: 'Imperium',     subtitle: 'The Strategy Case Competition',      org: 'IIM Indore',  date: 'Nov 2025',  result: 'Top 300 / 5000+',               resultColor: '#a78bfa', link: 'https://unstop.com/certificate-preview/ccec8c33-5165-437a-a50f-0b28ce8b4ef3?utm_campaign' },
    { id: 2, title: 'Productathon', subtitle: 'The Product Management Hackathon',   org: 'IIT Roorkee', date: '6 Feb 2026', result: 'National Finalist · Top 30 / 400+', resultColor: '#06b6d4', link: 'https://certificate.givemycertificate.com/c/8727d68a-5a12-4412-97ec-fcf56e58f5d9' },
    { id: 3, title: 'DataForge',    subtitle: 'The AI/ML Hackathon',                org: 'IIT Roorkee', date: '7 Feb 2026', result: 'National Finalist · Top 30 / 500+', resultColor: '#f472b6', link: 'https://certificate.givemycertificate.com/c/16080abe-3d73-4815-ace3-98b2ef3027b5' },
  ],
  'Professional': [
    { id: 4, title: 'PowerBI Workshop', subtitle: 'Data Visualization & Business Intelligence', org: 'CertX', date: '2026', result: 'Certified', resultColor: '#34d399', link: 'https://certx.in/certificate/36a28147-6eed-47a5-8342-e5f926ebba611113870' },
    { id: 5, title: 'AI Fundamentals', subtitle: 'AI Skill Fundamentals', org: 'DataCamp', date: '27 March 2026', result: 'Certified', resultColor: '#3b82f6', link: 'https://www.datacamp.com/skill-verification/AIF0029894483680' },
  ],
}

type Tab = keyof typeof certData
const tabColors: Record<Tab, string> = { 'Hackathons & Case Comps': '#7c3aed', 'Professional': '#06b6d4' }

function CertCard({ cert, color, index }: { cert: typeof certData['Hackathons & Case Comps'][0]; color: string; index: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ minWidth: '280px', maxWidth: '280px', padding: '1.75rem', borderRadius: '18px', border: `1px solid ${hovered ? color + '55' : 'rgba(255,255,255,0.07)'}`, background: hovered ? `${color}0d` : 'rgba(255,255,255,0.02)', transition: 'all 0.35s ease', cursor: 'default', display: 'flex', flexDirection: 'column', gap: '1.1rem', boxShadow: hovered ? `0 20px 60px ${color}22` : '0 4px 20px rgba(0,0,0,0.3)', transform: hovered ? 'translateY(-6px)' : 'translateY(0)', flexShrink: 0 }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: cert.resultColor, background: `${cert.resultColor}15`, border: `1px solid ${cert.resultColor}33`, padding: '0.28rem 0.7rem', borderRadius: '999px' }}>
          {cert.result}
        </span>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: '#fff', lineHeight: 1.1, marginBottom: '0.35rem' }}>{cert.title}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>{cert.subtitle}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color }}>{cert.org}</span>
        <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#334155' }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#475569' }}>{cert.date}</span>
      </div>
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
      <a href={cert.link} target="_blank" rel="noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color, background: `${color}12`, border: `1px solid ${color}35`, borderRadius: '8px', textDecoration: 'none', cursor: 'none', transition: 'all 0.2s', alignSelf: 'flex-start' }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${color}25`; el.style.borderColor = color }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${color}12`; el.style.borderColor = `${color}35` }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        View Certificate
      </a>
    </motion.div>
  )
}

export default function Certifications() {
  const ref        = useRef<HTMLElement>(null)
  const inView     = useInView(ref, { once: true, margin: '-80px' })
  const [tab, setTab] = useState<Tab>('Hackathons & Case Comps')
  const scrollRef  = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX     = useRef(0)
  const scrollLeft = useRef(0)
  const color      = tabColors[tab]

  const onMouseDown = (e: React.MouseEvent) => { isDragging.current = true; startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0); scrollLeft.current = scrollRef.current?.scrollLeft ?? 0 }
  const onMouseMove = (e: React.MouseEvent) => { if (!isDragging.current || !scrollRef.current) return; e.preventDefault(); scrollRef.current.scrollLeft = scrollLeft.current - (e.pageX - scrollRef.current.offsetLeft - startX.current) * 1.5 }
  const onMouseUp   = () => { isDragging.current = false }

  return (
    <>
      <style>{`
        .cert-wrap { padding: 0 4rem !important; }
        .cert-scroll { padding: 1rem 4rem 2rem !important; }
        @media (max-width: 768px) {
          .cert-wrap   { padding: 0 1.25rem !important; }
          .cert-scroll { padding: 1rem 1.25rem 2rem !important; }
          #certifications { padding: 4rem 0 !important; }
        }
      `}</style>

      <section id="certifications" ref={ref} style={{ position: 'relative', padding: '8rem 0', background: '#04040f', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '400px', background: `radial-gradient(ellipse, ${color}08 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', transition: 'background 0.6s' }} />

        <div className="cert-wrap" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.22,1,0.36,1] as const }} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em', color: '#fff', marginBottom: '0.5rem' }}>Achievements</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#64748b' }}>Competitions, hackathons and certifications</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15, ease: [0.22,1,0.36,1] as const }} style={{ display: 'flex', gap: '0.6rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {(Object.keys(certData) as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '0.5rem 1.4rem', borderRadius: '999px', fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 500, border: `1px solid ${tab === t ? tabColors[t]+'77' : 'rgba(255,255,255,0.08)'}`, background: tab === t ? `${tabColors[t]}1a` : 'transparent', color: tab === t ? tabColors[t] : '#64748b', cursor: 'none', transition: 'all 0.3s', boxShadow: tab === t ? `0 0 20px ${tabColors[t]}22` : 'none' }}>
                {t}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="cert-wrap" style={{ maxWidth: '1100px', margin: '0 auto', marginBottom: '0.75rem' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg>
            Drag to explore
          </span>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.3 }}>
          <div ref={scrollRef} className="cert-scroll"
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
            style={{ display: 'flex', gap: '1.1rem', overflowX: 'auto', overflowY: 'visible', scrollbarWidth: 'none', cursor: 'grab', userSelect: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
          >
            {certData[tab].map((cert, i) => (
              <CertCard key={cert.id} cert={cert} color={color} index={i} />
            ))}
            <div style={{ minWidth: '1rem', flexShrink: 0 }} />
          </div>
        </motion.div>

        <style>{`#certifications div::-webkit-scrollbar { display: none; }`}</style>
      </section>
    </>
  )
}
