'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useWindowSize } from '@/hooks/useWindowSize'

export default function Contact() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [focused, setFocused] = useState<string | null>(null)
  const { isMobile, isTablet } = useWindowSize()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', subject: '', message: '' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const inputStyle = (name: string): React.CSSProperties => ({
    width: '100%', padding: '0.85rem 1.1rem',
    fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#e2e8f0',
    background: focused === name ? 'rgba(124,58,237,0.06)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused === name ? 'rgba(124,58,237,0.45)' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: '10px', outline: 'none', transition: 'all 0.25s',
    boxShadow: focused === name ? '0 0 0 3px rgba(124,58,237,0.08)' : 'none',
    boxSizing: 'border-box',
  })

  const socials = [
    {
      label: 'GitHub', handle: '@CoolSpidey89', href: 'https://github.com/CoolSpidey89', color: '#a78bfa',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>,
    },
    {
      label: 'LinkedIn', handle: '@omparida07', href: 'https://www.linkedin.com/in/omparida07/', color: '#06b6d4',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    },
  ]

  return (
    <section id="contact" ref={ref} style={{ position: 'relative', padding: isMobile ? '4rem 0 3rem' : '8rem 0 6rem', background: '#04040f', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: '10%', left: '20%', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20%', right: '15%', width: '350px', height: '350px', background: 'radial-gradient(ellipse, rgba(6,182,212,0.05) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: isMobile ? '0 1.25rem' : isTablet ? '0 2rem' : '0 4rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.22,1,0.36,1] as const }} style={{ textAlign: 'center', marginBottom: isMobile ? '2.5rem' : '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: isMobile ? '2.5rem' : 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.02em', color: '#fff', marginBottom: '0.75rem' }}>
            Contact <span style={{ background: 'linear-gradient(135deg, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Me</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#64748b', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
            Have something in mind? Whether it's a project, collaboration, or just a hello — I'm all ears.
          </p>
        </motion.div>

        {/* Two col → single col on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1.6fr 1fr', gap: isMobile ? '2.5rem' : '4rem', alignItems: 'start' }}>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 20 : 0 }} animate={inView ? { opacity: 1, x: 0, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15, ease: [0.22,1,0.36,1] as const }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} style={inputStyle('name')} />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Email</label>
                <input name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" type="email" onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} style={inputStyle('email')} />
              </div>
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} placeholder="Project type, collaboration, internship..." onFocus={() => setFocused('subject')} onBlur={() => setFocused(null)} style={inputStyle('subject')} />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me what you're working on, what you need help with, or just drop a hello. I read every message." rows={6} onFocus={() => setFocused('message')} onBlur={() => setFocused(null)} style={{ ...inputStyle('message'), resize: 'vertical' } as React.CSSProperties} />
            </div>
            <motion.button onClick={handleSubmit} disabled={status === 'sending' || status === 'sent'} whileHover={{ y: -2, boxShadow: '0 0 40px rgba(124,58,237,0.6)' }} whileTap={{ scale: 0.98 }}
              style={{ padding: '0.95rem 2rem', fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff', background: status === 'sent' ? 'linear-gradient(135deg, #059669, #047857)' : 'linear-gradient(135deg, #7c3aed, #4f1d96)', border: 'none', borderRadius: '10px', cursor: 'none', transition: 'all 0.3s', boxShadow: '0 0 28px rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', alignSelf: isMobile ? 'stretch' : 'flex-start', width: isMobile ? '100%' : 'auto' }}>
              {status === 'sending' ? (
                <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />Sending...</>
              ) : status === 'sent' ? <>✓ Message Sent!</> : (
                <>Send Message <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></>
              )}
            </motion.button>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: isMobile ? 0 : 30, y: isMobile ? 20 : 0 }} animate={inView ? { opacity: 1, x: 0, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.25, ease: [0.22,1,0.36,1] as const }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Email */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', marginBottom: '0.3rem' }}>Email</div>
                <a href="mailto:om.25741@sscbs.du.ac.in" style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#a78bfa', textDecoration: 'none', wordBreak: 'break-all' }}>om.25741@sscbs.du.ac.in</a>
              </div>
            </div>
            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', marginBottom: '0.3rem' }}>Location</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#94a3b8' }}>Delhi, India 🇮🇳</div>
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

            {/* Socials */}
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', marginBottom: '1rem' }}>Find Me On</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {socials.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', textDecoration: 'none', cursor: 'none', transition: 'all 0.25s' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${s.color}44`; el.style.background = `${s.color}0a`; el.style.transform = 'translateX(4px)' }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.06)'; el.style.background = 'rgba(255,255,255,0.02)'; el.style.transform = '' }}
                  >
                    <div style={{ color: s.color }}>{s.icon}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, color: '#e2e8f0' }}>{s.label}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#475569' }}>{s.handle}</div>
                    </div>
                    <svg style={{ marginLeft: 'auto', color: '#334155' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.6 }} style={{ textAlign: 'center', marginTop: isMobile ? '3rem' : '6rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#1e293b' }}>
            © 2025 · Om Parida · Built with Next.js + Three.js
          </p>
        </motion.div>
      </div>
    </section>
  )
}
