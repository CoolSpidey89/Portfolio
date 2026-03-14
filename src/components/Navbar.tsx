'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const navLinks = [
  { label: 'Home',           href: '#hero'           },
  { label: 'About',          href: '#about'          },
  { label: 'Projects',       href: '#projects'       },
  { label: 'Skills',         href: '#skills'         },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact',        href: '#contact'        },
]

export default function Navbar() {
  const [scrolled,      setScrolled]  = useState(false)
  const [activeSection, setActive]    = useState('hero')
  const [menuOpen,      setMenuOpen]  = useState(false)
  const [hoverIdx,      setHoverIdx]  = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const sections = navLinks.map(l => l.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(sections[i]); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (href: string) => {
    const wasOpen = menuOpen
    setMenuOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }, wasOpen ? 350 : 0)
  }

  return (
    <>
      <style>{`
        /* Desktop: show links + socials, hide hamburger */
        .nav-desktop { display: flex !important; }
        .nav-hamburger { display: none !important; }

        /* Mobile: hide links + socials, show hamburger */
        @media (max-width: 768px) {
          .nav-desktop   { display: none !important; }
          .nav-hamburger { display: flex !important; }

          /* Critical: stop nav from overflowing viewport */
          .nav-bar {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: 100vw !important;
          }
        }
      `}</style>

      {/* ── Nav bar ── */}
      <motion.nav
        className="nav-bar"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 50,
          /* Fixed height — no layout shift */
          height: scrolled ? '58px' : '68px',
          padding: '0 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(4,4,15,0.82)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'height 0.35s ease, background 0.35s ease, border 0.35s ease',
          /* Never overflow horizontally */
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* ── Logo ── */}
        <motion.button
          onClick={() => scrollTo('#hero')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'none', border: 'none', cursor: 'none', flexShrink: 0, minWidth: 0 }}
        >
          {/* Spinning ring avatar */}
          <div style={{ position: 'relative', width: '34px', height: '34px', flexShrink: 0 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', inset: '-2px', borderRadius: '50%', background: 'conic-gradient(from 0deg, #7c3aed, #06b6d4, #a78bfa, #7c3aed)' }}
            />
            <div style={{ position: 'absolute', inset: '2px', borderRadius: '50%', background: '#04040f' }} />
            <div style={{ position: 'absolute', inset: '2px', borderRadius: '50%', overflow: 'hidden' }}>
              <Image src="/avatar.jpg" alt="Om" width={34} height={34} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#fff', lineHeight: 1.15, whiteSpace: 'nowrap' }}>Om Parida</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Portfolio</span>
          </div>
        </motion.button>

        {/* ── Desktop nav links ── */}
        <nav className="nav-desktop" style={{ alignItems: 'center', gap: '0' }}>
          {navLinks.map(({ label, href }, i) => {
            const isActive = activeSection === href.slice(1)
            const isHov    = hoverIdx === i
            return (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                style={{
                  position: 'relative',
                  padding: '0.45rem 0.85rem',
                  background: 'none', border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.83rem',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? '#fff' : isHov ? '#cbd5e1' : '#64748b',
                  cursor: 'none',
                  transition: 'color 0.2s',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
                {/* Animated underline for active */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-line"
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '0.85rem',
                      right: '0.85rem',
                      height: '1.5px',
                      borderRadius: '1px',
                      background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {/* Hover underline */}
                {isHov && !isActive && (
                  <motion.span
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '0.85rem',
                      right: '0.85rem',
                      height: '1px',
                      borderRadius: '1px',
                      background: 'rgba(255,255,255,0.12)',
                      transformOrigin: 'left',
                    }}
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* ── Desktop socials + hamburger ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>

          {/* Social icons — desktop only */}
          {[
            {
              href: 'https://github.com/CoolSpidey89',
              hoverColor: '#a78bfa',
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>,
            },
            {
              href: 'https://www.linkedin.com/in/omparida07/',
              hoverColor: '#06b6d4',
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
            },
          ].map((s, i) => (
            <motion.a
              key={i}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="nav-desktop"
              whileHover={{ y: -2 }}
              style={{ alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.08)', color: '#475569', textDecoration: 'none', transition: 'color 0.2s, border-color 0.2s, background 0.2s', cursor: 'none', flexShrink: 0 }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = s.hoverColor; el.style.borderColor = s.hoverColor + '55'; el.style.background = s.hoverColor + '12' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#475569'; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.background = 'transparent' }}
            >
              {s.icon}
            </motion.a>
          ))}

          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: '5px', background: 'none', border: 'none', cursor: 'none', padding: '4px', width: '32px', height: '32px', flexShrink: 0 }}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 6.5, width: '22px' } : { rotate: 0, y: 0, width: '22px' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'block', height: '1.5px', background: '#e2e8f0', transformOrigin: 'center', borderRadius: '1px' }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'block', width: '14px', height: '1.5px', background: 'rgba(255,255,255,0.35)', borderRadius: '1px' }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -6.5, width: '22px' } : { rotate: 0, y: 0, width: '22px' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'block', height: '1.5px', background: '#e2e8f0', transformOrigin: 'center', borderRadius: '1px' }}
            />
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dim backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 48, background: 'rgba(4,4,15,0.65)', backdropFilter: 'blur(4px)' }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                zIndex: 49,
                /* Never wider than 85% of screen */
                width: 'min(300px, 85vw)',
                background: 'rgba(6,6,20,0.97)',
                backdropFilter: 'blur(24px)',
                borderLeft: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Drawer header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(167,139,250,0.35)', flexShrink: 0 }}>
                    <Image src="/avatar.jpg" alt="Om" width={26} height={26} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Om Parida</span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#64748b', cursor: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {/* Nav links */}
              <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', overflowY: 'auto' }}>
                {navLinks.map(({ label, href }, i) => {
                  const isActive = activeSection === href.slice(1)
                  return (
                    <motion.button
                      key={href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.055, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => scrollTo(href)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 0.9rem', borderRadius: '9px', border: `1px solid ${isActive ? 'rgba(124,58,237,0.28)' : 'transparent'}`, background: isActive ? 'rgba(124,58,237,0.1)' : 'transparent', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: isActive ? 500 : 400, color: isActive ? '#c4b5fd' : '#94a3b8', cursor: 'none', transition: 'all 0.18s', textAlign: 'left', width: '100%' }}
                      onMouseEnter={e => { if (!isActive) { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.color = '#e2e8f0' } }}
                      onMouseLeave={e => { if (!isActive) { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#94a3b8' } }}
                    >
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isActive ? '#a78bfa' : 'rgba(255,255,255,0.12)', flexShrink: 0, boxShadow: isActive ? '0 0 7px #a78bfa' : 'none', transition: 'all 0.18s' }} />
                      {label}
                      {isActive && (
                        <svg style={{ marginLeft: 'auto', color: '#7c3aed', flexShrink: 0 }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                      )}
                    </motion.button>
                  )
                })}
              </nav>

              {/* Drawer footer — socials only */}
              <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <a href="https://github.com/CoolSpidey89" target="_blank" rel="noreferrer"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '0.75rem', cursor: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#a78bfa'; el.style.borderColor = 'rgba(167,139,250,0.3)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#64748b'; el.style.borderColor = 'rgba(255,255,255,0.08)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/omparida07/" target="_blank" rel="noreferrer"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '0.75rem', cursor: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#06b6d4'; el.style.borderColor = 'rgba(6,182,212,0.3)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#64748b'; el.style.borderColor = 'rgba(255,255,255,0.08)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
