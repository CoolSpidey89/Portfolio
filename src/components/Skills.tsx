'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

type Skill = { name: string; category: string; color: string; slug: string }

const skills: Skill[] = [
  { name: 'HTML5',         category: 'Languages', color: '#a78bfa', slug: 'html5'            },
  { name: 'CSS3',          category: 'Languages', color: '#a78bfa', slug: 'css3'             },
  { name: 'JavaScript',    category: 'Languages', color: '#a78bfa', slug: 'javascript'       },
  { name: 'Python',        category: 'Languages', color: '#a78bfa', slug: 'python'           },
  { name: 'C++',           category: 'Languages', color: '#a78bfa', slug: 'cplusplus'        },
  { name: 'React',         category: 'Frontend',  color: '#06b6d4', slug: 'react'            },
  { name: 'Next.js',       category: 'Frontend',  color: '#06b6d4', slug: 'nextdotjs'        },
  { name: 'Tailwind CSS',  category: 'Frontend',  color: '#06b6d4', slug: 'tailwindcss'      },
  { name: 'Framer Motion', category: 'Frontend',  color: '#06b6d4', slug: 'framer'           },
  { name: 'Django',        category: 'Backend',   color: '#34d399', slug: 'django'           },
  { name: 'REST APIs',     category: 'Backend',   color: '#34d399', slug: 'fastapi'          },
  { name: 'Pandas',        category: 'ML/Data',   color: '#f472b6', slug: 'pandas'           },
  { name: 'NumPy',         category: 'ML/Data',   color: '#f472b6', slug: 'numpy'            },
  { name: 'Matplotlib',    category: 'ML/Data',   color: '#f472b6', slug: 'plotly'           },
  { name: 'GitHub',        category: 'Tools',     color: '#fb923c', slug: 'github'           },
  { name: 'Vercel',        category: 'Tools',     color: '#fb923c', slug: 'vercel'           },
  { name: 'VS Code',       category: 'Tools',     color: '#fb923c', slug: 'visualstudiocode' },
  { name: 'Figma',         category: 'Tools',     color: '#fb923c', slug: 'figma'            },
  { name: 'Canva',         category: 'Tools',     color: '#fb923c', slug: 'canva'            },
  { name: 'Google Colab',  category: 'Tools',     color: '#fb923c', slug: 'googlecolab'      },
  { name: 'MS Excel',      category: 'Tools',     color: '#fb923c', slug: 'microsoftexcel'   },
  { name: 'PowerBI',       category: 'Tools',     color: '#fb923c', slug: 'powerbi'          },
  { name: 'MongoDB',       category: 'Databases', color: '#facc15', slug: 'mongodb'          },
]

const categories = ['All', ...Array.from(new Set(skills.map(s => s.category)))]

const categoryColors: Record<string, string> = {
  All: '#e2e8f0', Languages: '#a78bfa', Frontend: '#06b6d4',
  Backend: '#34d399', 'ML/Data': '#f472b6', Tools: '#fb923c', Databases: '#facc15',
}

function fibonacci3D(n: number, i: number): [number, number, number] {
  const phi   = Math.acos(1 - (2 * i) / n)
  const theta = Math.PI * (1 + Math.sqrt(5)) * i
  const r     = 2.2
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ]
}

function SkillNode({
  skill, position, active, hovered, onHover,
}: {
  skill: Skill
  position: [number, number, number]
  active: boolean
  hovered: boolean
  onHover: (s: Skill | null) => void
}) {
  const color = categoryColors[skill.category]
  return (
    <Html position={position} center style={{ pointerEvents: 'auto' }}>
      <div
        onMouseEnter={() => onHover(skill)}
        onMouseLeave={() => onHover(null)}
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '11px',
          background: hovered ? `${color}33` : active ? 'rgba(15,15,30,0.88)' : 'rgba(8,8,18,0.25)',
          border: `1px solid ${hovered ? color + 'bb' : active ? color + '44' : 'rgba(255,255,255,0.04)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'default',
          transition: 'all 0.22s ease',
          opacity: active ? 1 : 0.15,
          boxShadow: hovered ? `0 0 20px ${color}66` : active ? `0 2px 10px rgba(0,0,0,0.5)` : 'none',
          backdropFilter: 'blur(6px)',
          transform: hovered ? 'scale(1.25)' : 'scale(1)',
        }}
      >
        <img
          src={`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${skill.slug}.svg`}
          width={20}
          height={20}
          alt={skill.name}
          draggable={false}
          style={{
            display: 'block',
            filter: hovered
              ? 'invert(1) brightness(1.5)'
              : active ? 'invert(1) brightness(0.8)' : 'invert(1) brightness(0.25)',
            transition: 'filter 0.22s',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>
    </Html>
  )
}

function Globe({
  activeCategory,
  hoveredSkill,
  onHover,
}: {
  activeCategory: string
  hoveredSkill: Skill | null
  onHover: (s: Skill | null) => void
}) {
  const groupRef   = useRef<THREE.Group>(null)
  const isDragging = useRef(false)
  const prevMouse  = useRef({ x: 0, y: 0 })
  const velocity   = useRef({ x: 0, y: 0 })
  const autoRot    = useRef(0)

  const positions = useMemo<[number, number, number][]>(
    () => skills.map((_, i) => fibonacci3D(skills.length, i)),
    []
  )

  useFrame((_, delta) => {
    if (!groupRef.current) return
    if (!isDragging.current) {
      autoRot.current += delta * 0.14
      groupRef.current.rotation.y = autoRot.current + velocity.current.x
      groupRef.current.rotation.x = velocity.current.y * 0.25
      velocity.current.x *= 0.95
      velocity.current.y *= 0.95
    }
  })

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        isDragging.current = true
        prevMouse.current  = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }
      }}
      onPointerMove={(e) => {
        if (!isDragging.current || !groupRef.current) return
        const dx = e.nativeEvent.clientX - prevMouse.current.x
        const dy = e.nativeEvent.clientY - prevMouse.current.y
        velocity.current.x += dx * 0.003
        velocity.current.y += dy * 0.002
        groupRef.current.rotation.y += dx * 0.003
        groupRef.current.rotation.x += dy * 0.002
        prevMouse.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }
      }}
      onPointerUp={() => { isDragging.current = false }}
      onPointerLeave={() => { isDragging.current = false }}
    >
      {skills.map((skill, i) => (
        <SkillNode
          key={skill.name}
          skill={skill}
          position={positions[i]}
          active={activeCategory === 'All' || skill.category === activeCategory}
          hovered={hoveredSkill?.name === skill.name}
          onHover={onHover}
        />
      ))}
    </group>
  )
}

// Skill icon for the sidebar panel
function SkillIcon({ slug, color, size = 15 }: { slug: string; color: string; size?: number }) {
  const [err, setErr] = useState(false)
  if (err) {
    return (
      <div style={{ width: size, height: size, borderRadius: '3px', background: `${color}22`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '6px', fontWeight: 700, color }}>
        {slug.slice(0, 2).toUpperCase()}
      </div>
    )
  }
  return (
    <img
      src={`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`}
      width={size} height={size}
      alt=""
      draggable={false}
      onError={() => setErr(true)}
      style={{ flexShrink: 0, display: 'block', filter: 'invert(1)', opacity: 0.75 }}
    />
  )
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-80px' })
  const [activeCategory, setActiveCategory] = useState('All')
  const [hoveredSkill,   setHoveredSkill]   = useState<Skill | null>(null)
  const [mounted,        setMounted]        = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const groupedSkills = categories
    .filter(c => c !== 'All')
    .map(cat => ({ cat, color: categoryColors[cat], items: skills.filter(s => s.category === cat) }))

  const visibleSkills = activeCategory === 'All'
    ? groupedSkills
    : groupedSkills.filter(g => g.cat === activeCategory)

  return (
    <>
      <style>{`
        .skills-wrap   { padding: 0 4rem !important; }
        .skills-layout { grid-template-columns: 1fr 320px !important; }
        @media (max-width: 900px) {
          .skills-wrap   { padding: 0 1.5rem !important; }
          .skills-layout { grid-template-columns: 1fr !important; }
          .skills-canvas { height: 360px !important; }
          #skills        { padding: 5rem 0 !important; }
        }
      `}</style>

      <section
        id="skills"
        ref={sectionRef}
        style={{ position: 'relative', padding: '8rem 0', background: '#04040f', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div className="skills-wrap" style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            style={{ marginBottom: '2.5rem' }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em', color: '#fff', marginBottom: '0.5rem' }}>My Skills</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#475569' }}>Drag to rotate · Hover to inspect · Filter by category</p>
          </motion.div>

          {/* Filter buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
            style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}
          >
            {categories.map(cat => {
              const color    = categoryColors[cat]
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.4rem 1rem', borderRadius: '999px',
                    fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 500,
                    border: `1px solid ${isActive ? color + '66' : 'rgba(255,255,255,0.07)'}`,
                    background: isActive ? `${color}18` : 'transparent',
                    color: isActive ? color : '#475569',
                    cursor: 'none', transition: 'all 0.25s',
                    boxShadow: isActive ? `0 0 16px ${color}22` : 'none',
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </motion.div>

          {/* Globe + Skill list */}
          <div className="skills-layout" style={{ display: 'grid', gap: '2rem', alignItems: 'start' }}>

            {/* Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <div
                className="skills-canvas"
                style={{ width: '100%', height: '500px', position: 'relative', borderRadius: '18px', overflow: 'hidden' }}
              >
                {mounted && (
                  <Canvas
                    camera={{ position: [0, 0, 6], fov: 50 }}
                    gl={{ antialias: true, alpha: true }}
                    dpr={[1, 1.5]}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <ambientLight intensity={0.9} />
                    <pointLight position={[6, 6, 6]}   intensity={2}   color="#6d28d9" />
                    <pointLight position={[-6, -4, 4]} intensity={1.5} color="#06b6d4" />
                    <Globe
                      activeCategory={activeCategory}
                      hoveredSkill={hoveredSkill}
                      onHover={setHoveredSkill}
                    />
                  </Canvas>
                )}

                {/* Hover tooltip pinned to bottom */}
                <AnimatePresence>
                  {hoveredSkill && (
                    <motion.div
                      key={hoveredSkill.name}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      style={{ position: 'absolute', bottom: '1.25rem', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 20, background: 'rgba(4,4,15,0.92)', backdropFilter: 'blur(16px)', border: `1px solid ${categoryColors[hoveredSkill.category]}55`, borderRadius: '12px', padding: '0.55rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.65rem', boxShadow: `0 8px 32px ${categoryColors[hoveredSkill.category]}22`, whiteSpace: 'nowrap' }}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: categoryColors[hoveredSkill.category], boxShadow: `0 0 8px ${categoryColors[hoveredSkill.category]}` }} />
                      <div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{hoveredSkill.name}</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: categoryColors[hoveredSkill.category] }}>{hoveredSkill.category}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Skill list panel — exact same as original */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem', maxHeight: '500px', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {visibleSkills.map(({ cat, color, items }, gi) => (
                    <div key={cat} style={{ marginBottom: gi < visibleSkills.length - 1 ? '1.25rem' : 0 }}>

                      {/* Category header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0 }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color }}>{cat}</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: '#334155', marginLeft: 'auto' }}>{items.length}</span>
                      </div>

                      {/* Skill rows */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {items.map((skill, i) => {
                          const isHovered = hoveredSkill?.name === skill.name
                          return (
                            <motion.div
                              key={skill.name}
                              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04, duration: 0.25 }}
                              onMouseEnter={() => setHoveredSkill(skill)}
                              onMouseLeave={() => setHoveredSkill(null)}
                              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.45rem 0.65rem', borderRadius: '8px', border: `1px solid ${isHovered ? color + '55' : 'transparent'}`, background: isHovered ? `${color}0d` : 'transparent', transition: 'all 0.2s', cursor: 'default' }}
                            >
                              <SkillIcon slug={skill.slug} color={color} size={15} />
                              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: isHovered ? '#fff' : '#94a3b8', transition: 'color 0.2s' }}>
                                {skill.name}
                              </span>
                            </motion.div>
                          )
                        })}
                      </div>

                      {gi < visibleSkills.length - 1 && (
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.04)', marginTop: '1rem' }} />
                      )}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  )
}

//Skills updated with a 3D globe visualization using react-three-fiber, allowing users to interactively explore skills by category. The globe features smooth rotation, hover effects for skill details, and a sidebar listing skills by category.