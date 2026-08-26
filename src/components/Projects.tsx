'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

type Project = {
  id: number
  title: string
  subtitle: string
  desc: string
  tags: string[]
  color: string
  gradient: string
  demo: string | null
  code: string
  video: string | null
}

const projects: Project[] = [
  {
    id: 1,
    title: 'GitHub Profile Analyzer',
    subtitle: 'Developer Insights Tool',
    desc: 'A premium GitHub Profile Analyzer built using Vanilla JavaScript + GitHub API that fetches user profile & repositories, computes insights, shows language breakdown — all inside a smooth, animated UI.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'GitHub API', 'Chart.js'],
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #1a1035, #2d1b69)',
    demo: 'https://github-profile-analyzer-eta-ashy.vercel.app/',
    code: 'https://github.com/OmParida89/github-profile-analyzer',
    video: '/videos/github_analyzer.mp4',
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
    code: 'https://github.com/OmParida89/Smart-Expense-Visualizer',
    video: '/videos/SpendWise.mp4',
  },
  {
    id: 3,
    title: 'Portfolio',
    subtitle: 'Immersive Developer Portfolio',
    desc: 'A modern, immersive Full Stack developer portfolio built with Next.js, Three.js, and Framer Motion featuring 3D WebGL scenes, animated sections, and a custom cursor.',
    tags: ['Next.js', 'Three.js', 'Framer Motion', 'TypeScript', 'Tailwind CSS'],
    color: '#34d399',
    gradient: 'linear-gradient(135deg, #0a1f1a, #0d3321)',
    demo: 'https://om-parida.vercel.app',
    code: 'https://github.com/OmParida89/Portfolio',
    video: '/videos/Portfolio.mp4',
  },
  {
    id: 4,
    title: 'ExamChain',
    subtitle: 'Blockchain-Inspired Examination Platform',
    desc: 'ExamChain is a blockchain-inspired examination platform that gives each student a unique LLM-generated question variant, normalises scores, and stores questions in an append-only hash chain so even teachers do not see questions until the examination starts.',
    tags: ['React 19', 'Node.js', 'MongoDB Atlas', 'JWT Auth', 'OpenRouter API'],
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg, #07111f, #11284a)',
    demo: 'https://examchain-ruby.vercel.app',
    code: 'https://github.com/OmParida89/ExamChain-AI',
    video: '/videos/ExamChain.mp4',
  },
]

function projectVideoSources(video: string) {
  return { webm: video.replace(/\.mp4$/, '.webm'), mp4: video }
}

/* ── one card, billboarded via drei's Html, depth-scaled imperatively in useFrame ── */
function ProjectNode({
  project, position, setRef,
}: {
  project: Project
  position: [number, number, number]
  setRef: (el: HTMLDivElement | null) => void
}) {
  const src = project.video ? projectVideoSources(project.video) : null
  return (
    <Html position={position} center style={{ pointerEvents: 'none' }}>
      <div
        ref={setRef}
        data-project-id={project.id}
        style={{ pointerEvents: 'auto', width: '400px', cursor: 'none', willChange: 'transform, opacity' }}
      >
        <div style={{ borderRadius: '18px', overflow: 'hidden', border: `1px solid ${project.color}44`, background: project.gradient, boxShadow: '0 28px 80px rgba(0,0,0,0.6)' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7.5', background: 'rgba(0,0,0,0.3)' }}>
            {src && (
              <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                <source src={src.webm} type="video/webm" />
                <source src={src.mp4} type="video/mp4" />
              </video>
            )}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${project.color}, ${project.color}44)` }} />
          </div>
          <div style={{ padding: '1.15rem 1.3rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.2rem', color: '#fff', lineHeight: 1.2 }}>{project.title}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Tap to explore</div>
          </div>
        </div>
      </div>
    </Html>
  )
}

/* ── the rotating ring — auto-spins when idle, drag is driven from outside the canvas ── */
function ProjectRing({
  groupRef, isDragging, velocity, autoRot, nodeRefs,
}: {
  groupRef: React.RefObject<THREE.Group | null>
  isDragging: React.RefObject<boolean>
  velocity: React.RefObject<{ x: number }>
  autoRot: React.RefObject<number>
  nodeRefs: React.RefObject<(HTMLDivElement | null)[]>
}) {
  const n = projects.length
  const radius = 6

  const positions = useMemo<[number, number, number][]>(
    () => projects.map((_, i) => {
      const angle = (i / n) * Math.PI * 2
      return [radius * Math.sin(angle), 0, radius * Math.cos(angle)]
    }),
    [n]
  )
  const baseAngles = useMemo(() => projects.map((_, i) => (i / n) * Math.PI * 2), [n])

  useFrame((_, delta) => {
    const g = groupRef.current
    if (!g) return
    if (!isDragging.current) {
      autoRot.current += delta * 0.24
      g.rotation.y = autoRot.current + velocity.current.x
      velocity.current.x *= 0.94
    } else {
      autoRot.current = g.rotation.y
    }

    baseAngles.forEach((base, i) => {
      const angle = base + g.rotation.y
      const z = Math.cos(angle) // -1 (back) .. 1 (front)
      const t = (z + 1) / 2
      const scale = 0.88 + t * 0.12
      const opacity = 0.55 + t * 0.45
      const el = nodeRefs.current[i]
      if (el) {
        el.style.transform = `scale(${scale.toFixed(3)})`
        el.style.opacity = opacity.toFixed(3)
        el.style.zIndex = String(Math.round(z * 100))
      }
    })
  })

  return (
    <group ref={groupRef}>
      {projects.map((project, i) => (
        <ProjectNode
          key={project.id}
          project={project}
          position={positions[i]}
          setRef={el => { nodeRefs.current[i] = el }}
        />
      ))}
    </group>
  )
}

/* ── zoom modal — reuses the card-body classes below ── */
function ProjectModal({ project, onClose }: { project: Project | null, onClose: () => void }) {
  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [project, onClose])

  const src = project?.video ? projectVideoSources(project.video) : null

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(2,2,10,0.85)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'none' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '980px', width: '100%', maxHeight: '92vh', overflowY: 'auto', overflowX: 'hidden', borderRadius: '20px', border: `1px solid ${project.color}33`, background: project.gradient, boxShadow: '0 40px 120px rgba(0,0,0,0.75)' }}
          >
            <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2, width: '36px', height: '36px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', color: '#fff', cursor: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>

            {/* matches the videos' actual recorded ratio (~1920x900) — 16:9 was cropping real content out of frame */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7.5', background: 'rgba(0,0,0,0.3)', borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>
              {src && (
                <video autoPlay muted loop playsInline controls style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                  <source src={src.webm} type="video/webm" />
                  <source src={src.mp4} type="video/mp4" />
                </video>
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${project.color}, ${project.color}44)` }} />
            </div>

            <div className="project-body">
              <div className="project-title-row">
                <h3 className="project-title">{project.title}</h3>
                <span className="project-subtitle">— {project.subtitle}</span>
              </div>
              <p className="project-desc">{project.desc}</p>
              <div className="project-tags">
                {project.tags.map(tag => <span key={tag} className="project-tag">{tag}</span>)}
              </div>
              <div className="project-buttons">
                <a href={project.code} target="_blank" rel="noreferrer" className="project-btn-code" style={{ '--color': project.color } as React.CSSProperties}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                  Code
                </a>
                {project.demo ? (
                  <a href={project.demo} target="_blank" rel="noreferrer" className="project-btn-demo" style={{ '--color': project.color, '--colorfade': project.color + 'bb', '--shadow': project.color + '44' } as React.CSSProperties}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Live Demo
                  </a>
                ) : (
                  <span className="project-btn-nodemo">No Live Demo</span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── canvas wrapper — owns drag state at the DOM level so it works whether the
     gesture starts on empty space or on top of a card ── */
function ProjectsCanvas() {
  const groupRef   = useRef<THREE.Group>(null)
  const nodeRefs   = useRef<(HTMLDivElement | null)[]>([])
  const isDragging = useRef(false)
  const prevPos    = useRef({ x: 0, y: 0 })
  const dragDist   = useRef(0)
  const velocity   = useRef({ x: 0 })
  const autoRot    = useRef(0)
  const [mounted, setMounted] = useState(false)
  const [openProject, setOpenProject] = useState<Project | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true
    dragDist.current = 0
    prevPos.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    const dx = e.clientX - prevPos.current.x
    dragDist.current += Math.abs(dx) + Math.abs(e.clientY - prevPos.current.y)
    velocity.current.x += dx * 0.004
    if (groupRef.current) groupRef.current.rotation.y += dx * 0.006
    prevPos.current = { x: e.clientX, y: e.clientY }
  }
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false
    if (dragDist.current < 6) {
      // e.target is unreliable here — setPointerCapture reassigns it to the
      // capturing element (this wrapper) for every subsequent event on this
      // pointer, so it never points at the actual card underneath the tap.
      // elementFromPoint reads what's really at that screen position instead.
      const hit = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      const card = hit?.closest('[data-project-id]')
      if (card) {
        const id = Number(card.getAttribute('data-project-id'))
        const proj = projects.find(p => p.id === id)
        if (proj) setOpenProject(proj)
      }
    }
  }

  return (
    <>
      {/* direct-access buttons — reliable open path that doesn't depend on hitting a 3D card */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        {projects.map(project => (
          <button
            key={project.id}
            onClick={() => setOpenProject(project)}
            style={{
              padding: '0.5rem 1.1rem', borderRadius: '999px', cursor: 'none', transition: 'all 0.25s',
              fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 500,
              border: `1px solid ${project.color}33`, background: `${project.color}0d`, color: project.color,
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = `${project.color}88`; el.style.background = `${project.color}1a` }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = `${project.color}33`; el.style.background = `${project.color}0d` }}
          >
            {project.title}
          </button>
        ))}
      </div>

      <div
        className="projects-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => { isDragging.current = false }}
        style={{
          width: '100%', height: '640px', position: 'relative', touchAction: 'none', overflow: 'hidden',
          // hide the whole ring while the modal is open — drei's Html cards are portaled
          // outside normal DOM nesting, so they can render above the modal regardless of
          // its z-index. Hiding the source is more reliable than fighting stacking order.
          visibility: openProject ? 'hidden' : 'visible',
          pointerEvents: openProject ? 'none' : 'auto',
        }}
      >
        {mounted && (
          <Canvas camera={{ position: [0, 0.4, 10], fov: 48 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]} style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.9} />
            <pointLight position={[6, 6, 6]} intensity={2} color="#6d28d9" />
            <pointLight position={[-6, -4, 4]} intensity={1.5} color="#06b6d4" />
            <ProjectRing groupRef={groupRef} isDragging={isDragging} velocity={velocity} autoRot={autoRot} nodeRefs={nodeRefs} />
          </Canvas>
        )}
      </div>
      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </>
  )
}

export default function Projects() {
  return (
    <>
      <style>{`
        .projects-wrap { padding: 0 4rem; }
        @media (max-width: 900px) {
          .projects-wrap    { padding: 0 1.5rem !important; }
          .projects-canvas  { height: 460px !important; }
          #projects         { padding: 5rem 0 !important; }
        }

        /* ── modal body (also used by nothing else, so scoped simply) ── */
        .project-body { padding: 1.75rem 2rem; box-sizing: border-box; width: 100%; }
        .project-title-row { display: flex; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem; }
        .project-title { font-family: var(--font-display); font-weight: 600; font-size: 1.7rem; color: #fff; line-height: 1.1; margin: 0; }
        .project-subtitle { font-family: var(--font-body); font-weight: 300; font-size: 0.92rem; color: #94a3b8; white-space: nowrap; }
        .project-desc { font-family: var(--font-body); font-size: 0.88rem; color: #64748b; line-height: 1.7; margin: 0 0 1rem 0; }
        .project-tags { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 1.25rem; }
        .project-tag { padding: 0.28rem 0.75rem; font-family: var(--font-body); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #e2e8f0; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.11); border-radius: 6px; }
        .project-buttons { display: flex; gap: 0.65rem; flex-wrap: wrap; }
        .project-btn-code { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.65rem 1.3rem; font-family: var(--font-body); font-size: 0.8rem; font-weight: 500; color: #e2e8f0; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; text-decoration: none; cursor: none; transition: background 0.2s; }
        .project-btn-code:hover { background: rgba(255,255,255,0.13); }
        .project-btn-demo { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.65rem 1.3rem; font-family: var(--font-body); font-size: 0.8rem; font-weight: 600; color: #fff; background: linear-gradient(135deg, var(--color), var(--colorfade)); border: none; border-radius: 8px; text-decoration: none; cursor: none; transition: box-shadow 0.2s, transform 0.2s; box-shadow: 0 0 20px var(--shadow); }
        .project-btn-demo:hover { transform: translateY(-2px); box-shadow: 0 0 35px var(--color); }
        .project-btn-nodemo { display: inline-flex; align-items: center; padding: 0.65rem 1.3rem; font-family: var(--font-body); font-size: 0.8rem; font-weight: 500; color: #334155; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; }

        @media (max-width: 768px) {
          .project-body { padding: 1.1rem 1.1rem 1.25rem !important; }
          .project-title { font-size: 1.2rem !important; }
          .project-subtitle { font-size: 0.8rem !important; }
          .project-desc { font-size: 0.82rem !important; }
          .project-tag { font-size: 0.62rem !important; padding: 0.22rem 0.6rem !important; }
          .project-btn-code, .project-btn-demo, .project-btn-nodemo { padding: 0.6rem 1rem !important; font-size: 0.78rem !important; flex: 1 !important; justify-content: center !important; }
        }
      `}</style>

      <section id="projects" style={{ position: 'relative', padding: '8rem 0', background: '#04040f', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '480px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div className="projects-wrap" style={{ maxWidth: '1100px', margin: '0 auto', boxSizing: 'border-box' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            style={{ textAlign: 'center', marginBottom: '2.5rem' }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em', color: '#fff', marginBottom: '0.75rem' }}>Projects</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#475569' }}>Drag to rotate · Tap to explore</p>
          </motion.div>

          <ProjectsCanvas />
        </div>
      </section>
    </>
  )
}