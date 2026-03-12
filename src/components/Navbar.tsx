'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const navLinks = [
  { label: 'Home',           href: '#hero'          },
  { label: 'About',          href: '#about'         },
  { label: 'Projects',       href: '#projects'      },
  { label: 'Skills',         href: '#skills'        },
  { label: 'Certifications', href: '#certifications'},
  { label: 'Contact',        href: '#contact'       },
]

export default function Navbar() {
  const [scrolled,      setScrolled] = useState(false)
  const [activeSection, setActive]   = useState('hero')
  const [menuOpen,      setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const sections = navLinks.map(l => l.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(sections[i]); break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          padding: scrolled ? '0.75rem 3rem' : '1.25rem 3rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled ? 'rgba(4,4,15,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >

        {/* ── Left: Avatar + Name ── */}
        <button
          onClick={() => scrollTo('#hero')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'none', border: 'none', cursor: 'none' }}
        >
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            border: '2px solid rgba(167,139,250,0.5)',
            overflow: 'hidden', flexShrink: 0,
            background: 'linear-gradient(135deg, #6d28d9, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Replace with your photo:
                import Image from 'next/image'
                <Image src="/avatar.jpg" alt="Om" width={48} height={48} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            */}
            <Image src="/avatar.jpg" alt="Om" width={48} height={48} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.25rem', color: '#fff', lineHeight: 1.1 }}>
            My Portfolio
          </div>
        </button>

        {/* ── Center: Nav pill ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.25rem',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '999px',
          padding: '0.4rem 0.75rem',
        }}>
          {navLinks.map(({ label, href }) => {
            const id       = href.slice(1)
            const isActive = activeSection === id
            return (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                style={{
                  padding: '0.45rem 1.1rem',
                  borderRadius: '999px',
                  border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.03em',
                  cursor: 'none',
                  transition: 'all 0.25s',
                  background: isActive ? 'rgba(124,58,237,0.25)' : 'transparent',
                  color: isActive ? '#c4b5fd' : '#64748b',
                  boxShadow: isActive ? 'inset 0 0 0 1px rgba(124,58,237,0.4)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = '#e2e8f0'
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = '#64748b'
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* ── Right: GitHub + LinkedIn ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

          {/* GitHub */}
          <a
            href="https://github.com/CoolSpidey89"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '42px', height: '42px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: '#94a3b8', textDecoration: 'none',
              transition: 'all 0.25s', cursor: 'none',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(167,139,250,0.5)'
              el.style.color = '#c4b5fd'
              el.style.background = 'rgba(124,58,237,0.12)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(255,255,255,0.1)'
              el.style.color = '#94a3b8'
              el.style.background = 'rgba(255,255,255,0.04)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/omparida07"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '42px', height: '42px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: '#94a3b8', textDecoration: 'none',
              transition: 'all 0.25s', cursor: 'none',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(6,182,212,0.5)'
              el.style.color = '#06b6d4'
              el.style.background = 'rgba(6,182,212,0.08)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(255,255,255,0.1)'
              el.style.color = '#94a3b8'
              el.style.background = 'rgba(255,255,255,0.04)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="mobile-menu-btn"
            style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'none', padding: '4px' }}
          >
            <motion.span animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} style={{ display: 'block', width: '22px', height: '1.5px', background: '#fff', transformOrigin: 'center' }} />
            <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} style={{ display: 'block', width: '15px', height: '1.5px', background: 'rgba(255,255,255,0.5)' }} />
            <motion.span animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} style={{ display: 'block', width: '22px', height: '1.5px', background: '#fff', transformOrigin: 'center' }} />
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(4,4,15,0.97)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}
          >
            {navLinks.map(({ label, href }, i) => (
              <motion.button
                key={href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => scrollTo(href)}
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '2.5rem', color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', cursor: 'none' }}
              >
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
