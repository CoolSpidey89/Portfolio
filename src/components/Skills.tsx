'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { motion, useInView } from 'framer-motion'
import * as THREE from 'three'
import * as si from 'simple-icons'
import { useWindowSize } from '@/hooks/useWindowSize'

type Skill = { name: string; category: string; color: string; slug: string }

const skills: Skill[] = [
  { name: 'HTML5',        category: 'Languages', color: '#a78bfa', slug: 'html5'        },
  { name: 'CSS3',         category: 'Languages', color: '#a78bfa', slug: 'css3'         },
  { name: 'JavaScript',   category: 'Languages', color: '#a78bfa', slug: 'javascript'   },
  { name: 'Python',       category: 'Languages', color: '#a78bfa', slug: 'python'       },
  { name: 'C++',          category: 'Languages', color: '#a78bfa', slug: 'cplusplus'    },
  { name: 'React',        category: 'Frontend',  color: '#06b6d4', slug: 'react'        },
  { name: 'Next.js',      category: 'Frontend',  color: '#06b6d4', slug: 'nextdotjs'    },
  { name: 'Tailwind CSS', category: 'Frontend',  color: '#06b6d4', slug: 'tailwindcss'  },
  { name: 'Framer Motion',category: 'Frontend',  color: '#06b6d4', slug: 'framer'       },
  { name: 'Django',       category: 'Backend',   color: '#34d399', slug: 'django'       },
  { name: 'REST APIs',    category: 'Backend',   color: '#34d399', slug: 'fastapi'      },
  { name: 'Pandas',       category: 'ML/Data',   color: '#f472b6', slug: 'pandas'       },
  { name: 'NumPy',        category: 'ML/Data',   color: '#f472b6', slug: 'numpy'        },
  { name: 'Matplotlib',   category: 'ML/Data',   color: '#f472b6', slug: 'plotly'       },
  { name: 'GitHub',       category: 'Tools',     color: '#fb923c', slug: 'github'       },
  { name: 'Vercel',       category: 'Tools',     color: '#fb923c', slug: 'vercel'       },
  { name: 'VS Code',      category: 'Tools',     color: '#fb923c', slug: 'visualstudiocode' },
  { name: 'Figma',        category: 'Tools',     color: '#fb923c', slug: 'figma'        },
  { name: 'Canva',        category: 'Tools',     color: '#fb923c', slug: 'canva'        },
  { name: 'Google Colab', category: 'Tools',     color: '#fb923c', slug: 'googlecolab'  },
  { name: 'MS Excel',     category: 'Tools',     color: '#fb923c', slug: 'microsoftexcel' },
  { name: 'PowerBI',      category: 'Tools',     color: '#fb923c', slug: 'powerbi'      },
  { name: 'MongoDB',      category: 'Databases', color: '#facc15', slug: 'mongodb'      },
]

const categories = ['All', ...Array.from(new Set(skills.map(s => s.category)))]
const categoryColors: Record<string, string> = {
  All: '#e2e8f0', Languages: '#a78bfa', Frontend: '#06b6d4',
  Backend: '#34d399', 'ML/Data': '#f472b6', Tools: '#fb923c', Databases: '#facc15',
}

function getIcon(slug: string): string | null {
  const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`
  const icon = (si as Record<string, { svg: string } | undefined>)[key]
  return icon?.svg ?? null
}

function fibonacci3D(n: number, i: number): [number, number, number] {
  const phi   = Math.acos(1 - (2 * i) / n)
  const theta = Math.PI * (1 + Math.sqrt(5)) * i
  const r     = 2.2
  return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)]
}

function Cloud({ skills, activeCategory, onHover }: { skills: Skill[]; activeCategory: string; onHover: (s: Skill | null) => void }) {
  const groupRef  = useRef<THREE.Group>(null)
  const isDragging = useRef(false)
  const prevMouse  = useRef({ x: 0, y: 0 })
  const velocity   = useRef({ x: 0, y: 0 })
  const autoRotRef = useRef<number>(0)
  const { size } = useThree()

  useFrame((_, delta) => {
    if (!groupRef.current) return
    if (!isDragging.current) {
      autoRotRef.current += delta * 0.18
      groupRef.current.rotation.y = autoRotRef.current + velocity.current.x
      groupRef.current.rotation.x = velocity.current.y * 0.3
      velocity.current.x *= 0.95
      velocity.current.y *= 0.95
    }
  })

  const onPointerDown = (e: { clientX: number; clientY: number }) => {
    isDragging.current = true
    prevMouse.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerMove = (e: { clientX: number; clientY: number }) => {
    if (!isDragging.current || !groupRef.current) return
    const dx = e.clientX - prevMouse.current.x
    const dy = e.clientY - prevMouse.current.y
    velocity.current.x += dx * 0.004
    velocity.current.y += dy * 0.002
    groupRef.current.rotation.y += dx * 0.004
    groupRef.current.rotation.x += dy * 0.002
    prevMouse.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = () => { isDragging.current = false }

  return (
    <group ref={groupRef}
      onPointerDown={onPointerDown as never}
      onPointerMove={onPointerMove as never}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {skills.map((skill, i) => {
        const [x, y, z] = fibonacci3D(skills.length, i)
        const active  = activeCategory === 'All' || skill.category === activeCategory
        const color   = new THREE.Color(skill.color)
        return (
          <mesh key={skill.name} position={[x, y, z]}
            onPointerOver={() => onHover(skill)}
            onPointerOut={() => onHover(null)}
          >
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color={active ? color : new THREE.Color('#1e293b')} emissive={active ? color : new THREE.Color('#000')} emissiveIntensity={active ? 0.6 : 0} transparent opacity={active ? 1 : 0.15} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function Skills() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeCategory, setActiveCategory] = useState('All')
  const [hovered, setHovered] = useState<Skill | null>(null)
  const { isMobile, isTablet } = useWindowSize()

  const canvasSize = isMobile ? 320 : isTablet ? 380 : 440

  return (
    <section id="skills" ref={ref} style={{ position: 'relative', padding: isMobile ? '4rem 0' : '8rem 0', background: '#04040f', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 1.25rem' : isTablet ? '0 2rem' : '0 4rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.22,1,0.36,1] as const }} style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: isMobile ? '2.5rem' : 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em', color: '#fff', marginBottom: '0.5rem' }}>
            My Skills
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#475569' }}>
            {isMobile ? 'Tap a category to filter' : 'Drag to rotate · Hover to inspect · Filter by category'}
          </p>
        </motion.div>

        {/* Filter buttons */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1, ease: [0.22,1,0.36,1] as const }}
          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {categories.map(cat => {
            const color   = categoryColors[cat]
            const isActive = activeCategory === cat
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '0.4rem 1rem', borderRadius: '999px', fontFamily: 'var(--font-body)', fontSize: isMobile ? '0.7rem' : '0.78rem', fontWeight: 500, border: `1px solid ${isActive ? color + '66' : 'rgba(255,255,255,0.07)'}`, background: isActive ? `${color}18` : 'transparent', color: isActive ? color : '#475569', cursor: 'none', transition: 'all 0.25s', boxShadow: isActive ? `0 0 16px ${color}22` : 'none' }}>
                {cat}
              </button>
            )
          })}
        </motion.div>

        {/* Main layout */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1fr auto', gap: isMobile ? '2rem' : '3rem', alignItems: 'center' }}>

          {/* 3D Cloud */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, delay: 0.2, ease: [0.22,1,0.36,1] as const }}
            style={{ position: 'relative', width: '100%', maxWidth: isMobile ? '320px' : '500px', margin: '0 auto', aspectRatio: '1/1' }}>
            <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]} style={{ width: '100%', height: '100%' }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[5, 5, 5]} intensity={2} color="#6d28d9" />
              <pointLight position={[-5, -5, 3]} intensity={1.5} color="#06b6d4" />
              <Cloud skills={skills} activeCategory={activeCategory} onHover={setHovered} />
            </Canvas>

            {/* Tooltip */}
            {hovered && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', textAlign: 'center', zIndex: 10 }}>
                {(() => { const svg = getIcon(hovered.slug); return svg ? (
                  <div className="si-icon" style={{ color: hovered.color, width: '36px', height: '36px', margin: '0 auto 0.5rem', filter: `drop-shadow(0 0 8px ${hovered.color}88)` }} dangerouslySetInnerHTML={{ __html: svg }} />
                ) : (
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${hovered.color}22`, border: `1px solid ${hovered.color}55`, margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: hovered.color }}>
                    {hovered.name.slice(0, 2).toUpperCase()}
                  </div>
                ) })()}
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>{hovered.name}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: hovered.color, marginTop: '0.2rem' }}>{hovered.category}</div>
              </div>
            )}
          </motion.div>

          {/* Legend */}
          <motion.div initial={{ opacity: 0, x: isMobile ? 0 : 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.35, ease: [0.22,1,0.36,1] as const }}
            style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', flexWrap: 'wrap', gap: '0.6rem', minWidth: isMobile ? 'auto' : '180px' }}>
            {categories.filter(c => c !== 'All').map(cat => {
              const color    = categoryColors[cat]
              const count    = skills.filter(s => s.category === cat).length
              const isActive = activeCategory === cat
              return (
                <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? 'All' : cat)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.85rem', borderRadius: '8px', border: `1px solid ${isActive ? color + '55' : 'rgba(255,255,255,0.06)'}`, background: isActive ? `${color}12` : 'rgba(255,255,255,0.02)', cursor: 'none', transition: 'all 0.25s', textAlign: 'left' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 8px ${color}88` }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: isActive ? '#e2e8f0' : '#475569', flex: 1, whiteSpace: 'nowrap' }}>{cat}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: color, background: `${color}18`, padding: '0.1rem 0.45rem', borderRadius: '999px', fontWeight: 600 }}>{count}</span>
                </button>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
