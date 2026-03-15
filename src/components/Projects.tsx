'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

const projects = [
  {
    id: 1,
    index: '01',
    title: 'GitHub Profile\nAnalyzer',
    subtitle: 'Developer Insights Tool',
    desc: 'Fetches any GitHub user\'s profile and repositories, computes insights, and renders language breakdowns — all inside a smooth, animated UI built with Vanilla JS.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'GitHub API', 'Chart.js'],
    color: '#a78bfa',
    accent: '#7c3aed',
    demo: 'https://github-profile-analyzer-eta-ashy.vercel.app/',
    code: 'https://github.com/CoolSpidey89/github-profile-analyzer',
    video: '/videos/github_analyzer.mp4',
  },
  {
    id: 2,
    index: '02',
    title: 'SpendWise',
    subtitle: 'Smart Expense Visualizer',
    desc: 'Transforms raw CSV expense data into interactive financial dashboards with forecasts, category breakdowns, and exportable PDF reports.',
    tags: ['React.js', 'Chart.js', 'Tailwind CSS', 'PapaParse', 'jsPDF'],
    color: '#06b6d4',
    accent: '#0891b2',
    demo: 'https://smart-expense-visualizer.vercel.app/',
    code: 'https://github.com/CoolSpidey89/Smart-Expense-Visualizer',
    video: '/videos/SpendWise.mp4',
  },
  {
    id: 3,
    index: '03',
    title: 'Portfolio',
    subtitle: 'Immersive Developer Portfolio',
    desc: 'This very site — built with Next.js, Three.js, and Framer Motion. Features a 3D WebGL hero, animated sections, custom cursor, and scroll-driven interactions.',
    tags: ['Next.js', 'Three.js', 'Framer Motion', 'TypeScript', 'Tailwind CSS'],
    color: '#34d399',
    accent: '#059669',
    demo: 'https://portfolio-beta-coral-72.vercel.app/',
    code: 'https://github.com/CoolSpidey89/Portfolio',
    video: '/videos/Portfolio.mp4',
  },
  {
    id: 4,
    index: '04',
    title: 'LibTrack',
    subtitle: 'Library Management System',
    desc: 'A full-stack Django web app for managing books, students, and borrowing workflows through a clean, modern dashboard interface.',
    tags: ['Django', 'Python', 'Bootstrap', 'HTML'],
    color: '#f472b6',
    accent: '#db2777',
    demo: null,
    code: 'https://github.com/CoolSpidey89/Library-Management-System',
    video: '/videos/LibTrack.mp4',
  },
]

function ProjectScene({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref        = useRef<HTMLDivElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y       = useTransform(scrollYProgress, [0, 1], ['4%', '-4%'])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale   = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.96, 1, 1, 0.96])

  // Play video when scene enters viewport
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting)
        if (entry.isIntersecting) videoRef.current?.play()
        else { videoRef.current?.pause() }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
      className="project-scene"
    >
      {/* Outer frame */}
      <div
        className="scene-frame"
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          border: `1px solid ${project.color}22`,
          background: '#08080f',
          boxShadow: active
            ? `0 40px 120px ${project.color}18, 0 0 0 1px ${project.color}18`
            : '0 20px 60px rgba(0,0,0,0.4)',
          transition: 'box-shadow 0.6s ease',
        }}
      >
        {/* Video background */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/8', overflow: 'hidden' }}>
          <motion.div style={{ y, width: '100%', height: '115%', position: 'absolute', top: '-7.5%' }}>
            <video
              ref={videoRef}
              src={project.video}
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>

          {/* Gradient overlays */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, rgba(4,4,15,0.92) 0%, rgba(4,4,15,0.6) 50%, rgba(4,4,15,0.2) 100%)` }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,4,15,0.95) 0%, transparent 50%)' }} />

          {/* Content overlaid on video */}
          <div
            className="scene-content"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'flex-end',
              padding: '2.5rem',
            }}
          >
            <div style={{ maxWidth: '560px', width: '100%' }}>

              {/* Chapter number */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}
              >
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', color: project.color, textTransform: 'uppercase' }}>
                  Project {project.index}
                </span>
                <div style={{ height: '1px', width: '32px', background: `linear-gradient(90deg, ${project.color}, transparent)` }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: '#475569', letterSpacing: '0.1em' }}>
                  {project.subtitle}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.08 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                  color: '#fff',
                  lineHeight: 1.0,
                  letterSpacing: '-0.02em',
                  marginBottom: '1rem',
                  whiteSpace: 'pre-line',
                }}
              >
                {project.title}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.14 }}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '440px' }}
              >
                {project.desc}
              </motion.p>

              {/* Tags + CTA row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}
              >
                {/* Tags */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', flex: 1 }}>
                  {project.tags.map(tag => (
                    <span key={tag} style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 500, padding: '0.25rem 0.65rem', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', letterSpacing: '0.03em' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <a
                    href={project.code}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, color: '#e2e8f0', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', textDecoration: 'none', cursor: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.13)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                    Code
                  </a>
                  {project.demo ? (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: '#fff', background: project.accent, border: 'none', borderRadius: '8px', textDecoration: 'none', cursor: 'none', transition: 'all 0.2s', boxShadow: `0 4px 20px ${project.color}44` }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = `0 8px 28px ${project.color}66` }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = `0 4px 20px ${project.color}44` }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      Live Demo
                    </a>
                  ) : (
                    <span style={{ padding: '0.55rem 1rem', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#334155', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                      No Live Demo
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Accent color bar at bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${project.color}, ${project.color}44, transparent)` }} />
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <>
      <style>{`
        .projects-wrap { padding: 0 4rem !important; }
        .project-scene { margin-bottom: 2rem; }
        .scene-content { padding: 2.5rem !important; }

        @media (max-width: 768px) {
          .projects-wrap { padding: 0 1rem !important; }
          #projects { padding: 4rem 0 2rem !important; }
          .project-scene { margin-bottom: 1.25rem; }
          .scene-frame { border-radius: 16px !important; }
          .scene-content { padding: 1.25rem !important; }
        }
      `}</style>

      <section id="projects" style={{ position: 'relative', padding: '6rem 0 4rem', background: '#04040f' }}>

        {/* Background glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '500px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.05) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div className="projects-wrap" style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            style={{ marginBottom: '3.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em', color: '#fff' }}>
                Projects
              </h2>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {projects.length} works
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#475569', marginTop: '0.5rem' }}>
              A collection of things I've built
            </p>
          </motion.div>

          {/* Project scenes */}
          <div>
            {projects.map((project, i) => (
              <ProjectScene key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
