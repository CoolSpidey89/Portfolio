'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import * as si from 'simple-icons'

const categories = ['All', 'Languages', 'Frontend', 'Backend', 'ML / Data', 'Tools', 'Databases'] as const
type Category = typeof categories[number]

const categoryColors: Record<string, string> = {
  Languages:   '#a78bfa',
  Frontend:    '#06b6d4',
  Backend:     '#34d399',
  'ML / Data': '#f472b6',
  Tools:       '#fb923c',
  Databases:   '#facc15',
}

const skills = [
  // Languages
  { name: 'HTML5',         cat: 'Languages',  slug: 'html5'         },
  { name: 'CSS3',          cat: 'Languages',  slug: 'css3'          },
  { name: 'JavaScript',    cat: 'Languages',  slug: 'javascript'    },
  { name: 'Python',        cat: 'Languages',  slug: 'python'        },
  { name: 'C++',           cat: 'Languages',  slug: 'cplusplus'     },
  // Frontend
  { name: 'React',         cat: 'Frontend',   slug: 'react'         },
  { name: 'Next.js',       cat: 'Frontend',   slug: 'nextdotjs'     },
  { name: 'Tailwind CSS',  cat: 'Frontend',   slug: 'tailwindcss'   },
  { name: 'Framer Motion', cat: 'Frontend',   slug: 'framer'        },
  // Backend
  { name: 'Django',        cat: 'Backend',    slug: 'django'        },
  { name: 'REST APIs',     cat: 'Backend',    slug: 'fastapi'       },
  // ML / Data
  { name: 'Pandas',        cat: 'ML / Data',  slug: 'pandas'        },
  { name: 'NumPy',         cat: 'ML / Data',  slug: 'numpy'         },
  { name: 'Matplotlib',    cat: 'ML / Data',  slug: 'plotly'        },
  // Tools
  { name: 'GitHub',        cat: 'Tools',      slug: 'github'        },
  { name: 'Vercel',        cat: 'Tools',      slug: 'vercel'        },
  { name: 'VS Code',       cat: 'Tools',      slug: 'visualstudiocode' },
  { name: 'Figma',         cat: 'Tools',      slug: 'figma'         },
  { name: 'Canva',         cat: 'Tools',      slug: 'canva'         },
  { name: 'Google Colab',  cat: 'Tools',      slug: 'googlecolab'   },
  { name: 'MS Excel',      cat: 'Tools',      slug: 'microsoftexcel'},
  { name: 'PowerBI',       cat: 'Tools',      slug: 'powerbi'       },
  // Databases
  { name: 'MongoDB',       cat: 'Databases',  slug: 'mongodb'       },
]

function getIcon(slug: string): string | null {
  const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}` as keyof typeof si
  const icon = si[key] as { svg: string } | undefined
  return icon?.svg ?? null
}

function Cloud({ activeCategory }: { activeCategory: Category }) {
  const [positions, setPositions] = useState<{ x: number; y: number; z: number }[]>([])
  const [hovered, setHovered]     = useState<number | null>(null)
  const animRef  = useRef<number>(0)
  const rotRef   = useRef({ x: 0.3, y: 0 })
  const stateRef = useRef({ x: 0.3, y: 0 })
  const mouseRef = useRef({ dragging: false, lastX: 0, lastY: 0 })
  const [, forceRender] = useState(0)

  useEffect(() => {
    const n = skills.length
    const pts = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = golden * i
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r })
    }
    setPositions(pts)
  }, [])

  useEffect(() => {
    const animate = () => {
      if (!mouseRef.current.dragging) rotRef.current.y += 0.003
      stateRef.current = { ...rotRef.current }
      forceRender(n => n + 1)
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current!)
  }, [])

  const onMouseDown = (e: React.MouseEvent) => {
    mouseRef.current = { dragging: true, lastX: e.clientX, lastY: e.clientY }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!mouseRef.current.dragging) return
    const dx = e.clientX - mouseRef.current.lastX
    const dy = e.clientY - mouseRef.current.lastY
    rotRef.current.y += dx * 0.008
    rotRef.current.x = Math.max(-0.8, Math.min(0.8, rotRef.current.x + dy * 0.008))
    mouseRef.current.lastX = e.clientX
    mouseRef.current.lastY = e.clientY
  }
  const onMouseUp = () => { mouseRef.current.dragging = false }

  const RADIUS = 210

  const projected = useMemo(() => {
    if (!positions.length) return []
    const { x: rx, y: ry } = stateRef.current
    const cx = Math.cos(rx), sx = Math.sin(rx)
    const cy = Math.cos(ry), sy = Math.sin(ry)

    return positions.map((p, i) => {
      const x1 = p.x * cy + p.z * sy
      const z1 = -p.x * sy + p.z * cy
      const y2 = p.y * cx - z1 * sx
      const z2 = p.y * sx + z1 * cx
      const scale = (z2 + 2) / 3
      const skill = skills[i]
      const isActive = activeCategory === 'All' || skill.cat === activeCategory
      return { x: x1 * RADIUS, y: y2 * RADIUS, z: z2, scale, skill, index: i, isActive, color: categoryColors[skill.cat] }
    }).sort((a, b) => a.z - b.z)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions, stateRef.current, activeCategory])

  return (
    <div
      onMouseDown={onMouseDown} onMouseMove={onMouseMove}
      onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      style={{ position: 'relative', width: '500px', height: '500px', cursor: 'none', userSelect: 'none' }}
    >
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: '40px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

      {projected.map(({ x, y, z, scale, skill, index, isActive, color }) => {
        const isHov  = hovered === index
        const svgRaw = getIcon(skill.slug)
        const size   = 42

        return (
          <div
            key={skill.name}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              zIndex: Math.round(z * 100 + 100),
              opacity: isActive ? (0.35 + scale * 0.65) : 0.07,
              transition: 'opacity 0.5s',
            }}
          >
            <div style={{
              width: `${size}px`, height: `${size}px`,
              borderRadius: '10px',
              background: isHov ? `${color}28` : `${color}0e`,
              border: `1px solid ${isHov ? color + '99' : color + '2a'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isHov ? `0 0 22px ${color}77` : 'none',
              transition: 'all 0.25s',
              transform: `scale(${isHov ? 1.25 : scale * 0.35 + 0.65})`,
            }}>
              {svgRaw ? (
                <div
                  className="si-icon"
                  dangerouslySetInnerHTML={{ __html: svgRaw }}
                  style={{
                    width: '20px', height: '20px',
                    color: isHov ? color : `${color}cc`,
                    transition: 'color 0.25s',
                  }}
                />
              ) : (
                <span style={{ fontSize: '0.65rem', color, fontFamily: 'var(--font-body)', fontWeight: 700 }}>
                  {skill.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            {isHov && (
              <div style={{
                position: 'absolute', bottom: '110%', left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(4,4,15,0.96)',
                border: `1px solid ${color}55`,
                borderRadius: '8px', padding: '0.4rem 0.9rem',
                whiteSpace: 'nowrap', pointerEvents: 'none',
                boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 12px ${color}33`,
              }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>{skill.name}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color, marginTop: '1px' }}>{skill.cat}</div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Skills() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeCategory, setActiveCategory] = useState<Category>('All')

  return (
    <section id="skills" ref={ref} style={{ position: 'relative', padding: '8rem 0', background: '#04040f', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 4rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em', color: '#fff', marginBottom: '0.75rem' }}>
            My Skills
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#64748b' }}>
            Drag to rotate · Hover to inspect · Filter by category
          </p>
        </motion.div>

        {/* Filter buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
          style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '3.5rem' }}
        >
          {categories.map(cat => {
            const isActive = activeCategory === cat
            const color    = cat === 'All' ? '#7c3aed' : categoryColors[cat]
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: '0.45rem 1.2rem', borderRadius: '999px',
                fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 500,
                border: `1px solid ${isActive ? color + '88' : 'rgba(255,255,255,0.08)'}`,
                background: isActive ? `${color}22` : 'transparent',
                color: isActive ? color : '#64748b',
                cursor: 'none', transition: 'all 0.25s',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}
              onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = '#e2e8f0'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)' } }}
              onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = '#64748b'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)' } }}
              >
                {cat !== 'All' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />}
                {cat}
              </button>
            )
          })}
        </motion.div>

        {/* Cloud + Legend */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <Cloud activeCategory={activeCategory} />
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '200px' }}
          >
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', marginBottom: '0.5rem' }}>
              Categories
            </div>
            {Object.entries(categoryColors).map(([cat, color]) => {
              const count    = skills.filter(s => s.cat === cat).length
              const isActive = activeCategory === cat || activeCategory === 'All'
              return (
                <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? 'All' : cat as Category)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.85rem',
                  background: 'none', border: 'none', cursor: 'none',
                  opacity: isActive ? 1 : 0.3, transition: 'opacity 0.3s', padding: 0, textAlign: 'left',
                }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${color}22`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, color: '#e2e8f0' }}>{cat}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: '#475569' }}>{count} skill{count !== 1 ? 's' : ''}</div>
                  </div>
                </button>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
