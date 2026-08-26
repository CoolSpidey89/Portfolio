'use client'

import { motion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const bgVariants: Variants = {
  hidden: { opacity: 0, scale: 1.05 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] } },
}

const contentContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', damping: 24, stiffness: 100 } },
}

const titleLineVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', damping: 28, stiffness: 80, mass: 1.2 } },
}

export default function Hero() {
  return (
    <section id="hero" style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* background image */}
      <motion.div
        variants={bgVariants}
        initial="hidden"
        animate="show"
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      >
        <img
          src="https://assets.watermelon.sh/bg-hero-38.avif"
          alt="Astronaut looking at a glowing planet"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'bottom' }}
        />
      </motion.div>

      {/* scrim so text stays legible over the sky/horizon */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(4,4,15,0.6) 0%, rgba(4,4,15,0.15) 28%, rgba(4,4,15,0.55) 62%, rgba(4,4,15,0.95) 100%)',
      }} />

      {/* content — clustered together in the upper dark sky, clear of the horizon glow and the astronaut */}
      <div style={{
        position: 'relative', zIndex: 10, height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
        padding: '0 1.5rem', paddingTop: 'clamp(5.5rem, 13vh, 8.5rem)', textAlign: 'center',
      }}>
        <motion.div
          variants={contentContainerVariants}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '760px' }}
        >
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#ffffff', fontSize: 'clamp(2.75rem, 6vw, 5rem)', filter: 'drop-shadow(0 4px 24px rgba(4,4,15,0.9)) drop-shadow(0 0 40px rgba(4,4,15,0.7))' }}>
            <motion.span variants={titleLineVariants} style={{ display: 'block' }}>Om</motion.span>
            <motion.span
              variants={titleLineVariants}
              style={{ display: 'block', backgroundImage: 'linear-gradient(135deg, #c4b5fd, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Parida.
            </motion.span>
          </h1>

          <motion.p
            variants={itemVariants}
            style={{ marginTop: '1.5rem', maxWidth: '520px', fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)', lineHeight: 1.8, color: '#cbd5e1', fontWeight: 300 }}
          >
            Full-stack developer obsessed with immersive interfaces, 3D web experiences, and code that performs as good as it looks.
          </motion.p>

          <motion.div variants={itemVariants} style={{ marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '52px', padding: '0 2.5rem', borderRadius: '10px', border: 'none', color: '#ffffff', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.95rem', cursor: 'none', background: 'linear-gradient(135deg, #7c3aed, #4f1d96)', boxShadow: '0 0 28px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.1)', transition: 'box-shadow 0.3s, transform 0.3s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 0 45px rgba(124,58,237,0.75)'; el.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 0 28px rgba(124,58,237,0.5)'; el.style.transform = '' }}
            >
              View My Work
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ minHeight: '52px', padding: '0 2.5rem', borderRadius: '10px', border: '1px solid rgba(167,139,250,0.35)', background: 'rgba(255,255,255,0.04)', color: '#c4b5fd', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.95rem', cursor: 'none', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#a78bfa'; el.style.background = 'rgba(167,139,250,0.1)'; el.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(167,139,250,0.35)'; el.style.background = 'rgba(255,255,255,0.04)'; el.style.transform = '' }}
            >
              Get In Touch
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
