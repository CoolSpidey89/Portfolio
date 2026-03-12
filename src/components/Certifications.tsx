'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const certData = {
  Hackathons: [
    { id: 1, title: 'Code Kshetra 2.0',  org: 'JIMS, Rohini',   date: 'Feb, 2025', desc: 'Top 10 finish in a 24-hour hackathon. Built a real-time disaster response coordination platform.', link: '#', side: 'left'  as const },
    { id: 2, title: 'BrainWave',          org: 'DTU, Delhi',     date: '2024',       desc: 'Winner — AI/ML track. Developed an NLP-based mental health support chatbot.',                       link: '#', side: 'right' as const },
    { id: 3, title: 'HackWithIndia',      org: 'Online',         date: 'Aug, 2024',  desc: 'Finalist. Built a smart waste management system using IoT sensor simulation.',                     link: '#', side: 'left'  as const },
  ],
  Professional: [
    { id: 4, title: 'AWS Solutions Architect',  org: 'Amazon Web Services', date: 'Jan 2024', desc: 'Associate level. Cloud architecture, security, and cost optimization on AWS infrastructure.', link: '#', side: 'left'  as const },
    { id: 5, title: 'Meta Front-End Developer', org: 'Meta / Coursera',     date: 'Mar 2023', desc: 'Professional certificate covering React, advanced CSS, and accessibility standards.',         link: '#', side: 'right' as const },
    { id: 6, title: 'Google UX Design',         org: 'Google / Coursera',   date: 'Aug 2023', desc: '7-course series: UX research, wireframing, prototyping, and Figma design systems.',         link: '#', side: 'left'  as const },
  ],
}

type Tab = keyof typeof certData

function CertCard({
  cert, accent, index, inView,
}: {
  cert: typeof certData.Hackathons[0]
  accent: string
  index: number
  inView: boolean
}) {
  const isLeft = cert.side === 'left'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 1fr', alignItems: 'center' }}>

      {/* Left slot */}
      <div style={{ paddingRight: '2rem' }}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -120 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 }}
            transition={{ duration: 2.5, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <CardContent cert={cert} accent={accent} />
          </motion.div>
        )}
      </div>

      {/* Center dot */}
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.12 + 0.2 }}
          style={{
            width: '14px', height: '14px', borderRadius: '50%',
            background: accent,
            boxShadow: `0 0 0 4px ${accent}22, 0 0 16px ${accent}66`,
            flexShrink: 0,
          }}
        />
      </div>

      {/* Right slot */}
      <div style={{ paddingLeft: '2rem' }}>
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 120 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
            transition={{ duration: 2.5, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <CardContent cert={cert} accent={accent} />
          </motion.div>
        )}
      </div>

    </div>
  )
}

function CardContent({
  cert, accent,
}: {
  cert: typeof certData.Hackathons[0]
  accent: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '1.5rem 1.75rem',
        borderRadius: '12px',
        border: `1px solid ${hovered ? accent + '55' : 'rgba(255,255,255,0.07)'}`,
        background: hovered ? `${accent}0d` : 'rgba(255,255,255,0.02)',
        transition: 'all 0.3s',
        cursor: 'default',
      }}
    >
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', color: '#f1f5f9', marginBottom: '0.35rem' }}>
        {cert.title}
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: accent, marginBottom: '0.75rem', fontWeight: 500 }}>
        {cert.org} · {cert.date}
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', lineHeight: 1.7, color: '#64748b', marginBottom: '1.25rem' }}>
        {cert.desc}
      </div>

      {/* View Certificate button */}
      <a
        href={cert.link}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.45rem 1rem',
          fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 500,
          letterSpacing: '0.04em',
          color: accent,
          background: `${accent}15`,
          border: `1px solid ${accent}40`,
          borderRadius: '6px',
          textDecoration: 'none',
          transition: 'all 0.2s',
          cursor: 'none',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.background = `${accent}28`
          el.style.borderColor = accent
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.background = `${accent}15`
          el.style.borderColor = `${accent}40`
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        View Certificate
      </a>
    </div>
  )
}

export default function Certifications() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })
  const [tab, setTab] = useState<Tab>('Hackathons')
  const accent = tab === 'Hackathons' ? '#7c3aed' : '#06b6d4'

  return (
    <section id="certifications" ref={ref} style={{ position: 'relative', padding: '8rem 0', background: '#04040f', overflow: 'hidden' }}>

      {/* bg glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '400px', background: `radial-gradient(ellipse, ${accent}06 0%, transparent 70%)`, filter: 'blur(50px)', pointerEvents: 'none', transition: 'background 0.6s' }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 4rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          style={{ textAlign: 'center', marginBottom: '1.5rem' }}
        >
          {/* Ghost heading — smaller and more visible */}
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)',
            lineHeight: 1,
            marginBottom: '0.5rem',
          }}>
            Certifications
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
            Learning and professional achievements.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
          style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '4rem' }}
        >
          {(Object.keys(certData) as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '0.55rem 1.75rem', borderRadius: '999px',
              fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 500,
              border: 'none', cursor: 'none', transition: 'all 0.3s',
              background: tab === t ? (t === 'Hackathons' ? '#7c3aed' : '#06b6d4') : 'transparent',
              color: tab === t ? '#fff' : '#64748b',
              outline: tab !== t ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}>{t}</button>
          ))}
        </motion.div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>

          {/* Vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
            style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0,
              width: '1px', transform: 'translateX(-50%)', transformOrigin: 'top',
              background: `linear-gradient(to bottom, ${accent}, ${accent}44, transparent)`,
              transition: 'background 0.6s',
            }}
          />

          <AnimatePresence mode="wait">
            <div key={tab} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {certData[tab].map((cert, i) => (
                <CertCard key={cert.id} cert={cert} accent={accent} index={i} inView={inView} />
              ))}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
