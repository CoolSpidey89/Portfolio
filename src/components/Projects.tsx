'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useWindowSize } from '@/hooks/useWindowSize'

const projects = [
  {
    id: 1,
    title: 'GitHub Profile Analyzer',
    subtitle: 'Developer Insights Tool',
    desc: 'A premium GitHub Profile Analyzer built using Vanilla JavaScript + GitHub API that fetches user profile & repositories, computes insights, shows language breakdown — all inside a smooth, animated UI.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'GitHub API', 'Chart.js'],
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #1a1035, #2d1b69)',
    demo: 'https://github-profile-analyzer-eta-ashy.vercel.app/',
    code: 'https://github.com/CoolSpidey89/github-profile-analyzer',
    video: '/videos/github_analyzer.mp4' as string | null,
  },
  {
    id: 2,
    title: 'SpendWise',
    subtitle: 'Smart Expense Visualizer',
    desc: 'A modern financial analytics dashboard built with React.js that transforms raw CSV expense data into interactive insights, forecasts, and visual reports.',
    tags: ['React.js', 'Chart.js', 'Tailwind CSS', 'PapaParse', 'jsPDF'],
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #0c1a2e, #0e3a5c)',
    demo: 'https://smart-expense-visualizer.vercel.app/',
    code: 'https://github.com/CoolSpidey89/Smart-Expense-Visualizer',
    video: '/videos/SpendWise.mp4' as string | null,
  },
  {
    id: 3,
    title: 'Portfolio',
    subtitle: 'Immersive Developer Portfolio',
    desc: 'A modern, immersive Full Stack developer portfolio built with Next.js, Three.js, and Framer Motion featuring 3D WebGL scenes, animated sections, and a custom cursor.',
    tags: ['Next.js', 'Three.js', 'Framer Motion', 'TypeScript', 'Tailwind CSS'],
    color: '#34d399',
    gradient: 'linear-gradient(135deg, #0a1f1a, #0d3321)',
    demo: 'https://portfolio-beta-coral-72.vercel.app/',
    code: 'https://github.com/CoolSpidey89/Portfolio',
    video: '/videos/Portfolio.mp4' as string | null,
  },
  {
    id: 4,
    title: 'LibTrack',
    subtitle: 'Library Management System',
    desc: 'A full-stack Library Management Web Application built using Django that allows efficient management of books, students, and borrowing workflows through a modern dashboard interface.',
    tags: ['Django', 'Python', 'Bootstrap', 'HTML'],
    color: '#f472b6',
    gradient: 'linear-gradient(135deg, #1f0a1a, #3d0d2a)',
    demo: null as string | null,
    code: 'https://github.com/CoolSpidey89/Library-Management-System',
    video: '/videos/LibTrack.mp4' as string | null,
  },
]

function ProjectCard({ project, index, isMobile }: { project: typeof projects[0]; index: number; isMobile: boolean }) {
  return (
    <div style={{ position: isMobile ? 'relative' : 'sticky', top: isMobile ? 'auto' : `${80 + index * 24}px`, zIndex: index + 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        style={{
          borderRadius: '20px', overflow: 'hidden',
          border: `1px solid ${project.color}33`,
          background: project.gradient,
          boxShadow: `0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px ${project.color}22`,
          marginBottom: '1.5rem',
        }}
      >
        {/* Video preview */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: isMobile ? '16/9' : '16/7', overflow: 'hidden', background: 'rgba(0,0,0,0.3)' }}>
          {project.video ? (
            <video
              src={project.video}
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onLoadStart={e => {
                const v = e.currentTarget
                const observer = new IntersectionObserver(
                  ([entry]) => { if (entry.isIntersecting) v.play() },
                  { threshold: 0.3 }
                )
                observer.observe(v)
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#334155' }}>No preview available</span>
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${project.color}, ${project.color}44)` }} />
        </div>

        {/* Info */}
        <div style={{ padding: isMobile ? '1.25rem' : '2rem 2.5rem', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: isMobile ? '1.25rem' : '2rem' }}>
          <div style={{ flex: 1 }}>
            {/* Tags */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              {project.tags.map(tag => (
                <span key={tag} style={{ padding: '0.25rem 0.7rem', fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#e2e8f0', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px' }}>
                  {tag}
                </span>
              ))}
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: isMobile ? '1.4rem' : '1.8rem', color: '#fff', marginBottom: '0.25rem', lineHeight: 1.1 }}>
              {project.title}
              {!isMobile && <span style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1rem', color: '#94a3b8', marginLeft: '0.75rem' }}>— {project.subtitle}</span>}
            </h3>
            {isMobile && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{project.subtitle}</p>}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: isMobile ? '0.8rem' : '0.9rem', color: '#64748b', lineHeight: 1.7, marginTop: '0.5rem', maxWidth: '520px' }}>
              {project.desc}
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0, flexWrap: 'wrap' }}>
            <a href={project.code} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 500, color: '#e2e8f0', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', textDecoration: 'none', cursor: 'none', transition: 'all 0.25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              Code
            </a>

            {project.demo ? (
              <a href={project.demo} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, color: '#fff', background: `linear-gradient(135deg, ${project.color}, ${project.color}bb)`, border: 'none', borderRadius: '8px', textDecoration: 'none', cursor: 'none', transition: 'all 0.25s', boxShadow: `0 0 20px ${project.color}44` }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = `0 0 35px ${project.color}77` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = `0 0 20px ${project.color}44` }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Live Demo
              </a>
            ) : (
              <span style={{ padding: '0.65rem 1.25rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 500, color: '#334155', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                No Live Demo
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Projects() {
  const { isMobile, isTablet } = useWindowSize()

  return (
    <section id="projects" style={{ position: 'relative', padding: isMobile ? '4rem 0' : '2rem 0 4rem', background: '#04040f' }}>
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '0 1.25rem' : isTablet ? '0 2rem' : '0 4rem' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: isMobile ? '2.5rem' : 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em', color: '#fff', marginBottom: '0.75rem' }}>
            Projects
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#64748b' }}>A collection of things I've built</p>
        </motion.div>

        <div style={{ position: 'relative' }}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  )
}
