'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars, MeshDistortMaterial, Environment } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

function Orb() {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.x = clock.getElapsedTime() * 0.15
    mesh.current.rotation.y = clock.getElapsedTime() * 0.2
  })
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={mesh} position={[2.8, 0, 0]} scale={1.6}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial color="#6d28d9" emissive="#3b0764" emissiveIntensity={0.6} roughness={0.1} metalness={0.8} distort={0.45} speed={2} transparent opacity={0.92} />
      </mesh>
    </Float>
  )
}

function Ring() {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.x = Math.PI / 2.5 + Math.sin(clock.getElapsedTime() * 0.4) * 0.1
    mesh.current.rotation.z = clock.getElapsedTime() * 0.15
  })
  return (
    <Float speed={1.5} floatIntensity={0.5}>
      <mesh ref={mesh} position={[2.8, 0, 0]}>
        <torusGeometry args={[2.0, 0.012, 16, 120]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.2} transparent opacity={0.6} />
      </mesh>
    </Float>
  )
}

function RingOuter() {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.x = Math.PI / 3 + Math.cos(clock.getElapsedTime() * 0.3) * 0.15
    mesh.current.rotation.z = -clock.getElapsedTime() * 0.1
  })
  return (
    <Float speed={1.2} floatIntensity={0.3}>
      <mesh ref={mesh} position={[2.8, 0, 0]}>
        <torusGeometry args={[2.6, 0.006, 16, 120]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.8} transparent opacity={0.35} />
      </mesh>
    </Float>
  )
}

function Particles({ count = 200 }) {
  const mesh = useRef<THREE.Points>(null)
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const c1  = new THREE.Color('#6d28d9')
    const c2  = new THREE.Color('#06b6d4')
    for (let i = 0; i < count; i++) {
      pos[i*3]=(Math.random()-.5)*14; pos[i*3+1]=(Math.random()-.5)*10; pos[i*3+2]=(Math.random()-.5)*8
      const c=Math.random()>.5?c1:c2
      col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b
    }
    return [pos, col]
  }, [count])
  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.y = clock.getElapsedTime() * 0.03
    mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.1
  })
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

function CameraRig() {
  const { camera, mouse } = useThree()
  useFrame(() => {
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.04
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })
  return null
}

const roles     = ['Full Stack Developer', 'Machine Learning Enthusiast', 'AI Explorer']
const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } }
const item      = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } } }

export default function Hero() {
  return (
    <>
      <style>{`
        .hero-content { padding: 0 10rem 0 1rem !important; }
        .hero-title    { font-size: clamp(3.8rem, 7vw, 7rem) !important; }
        .hero-buttons  { flex-direction: row !important; }
        @media (max-width: 1024px) {
          .hero-content { padding: 0 4rem !important; }
        }
        @media (max-width: 768px) {
          .hero-content  { padding: 0 1.5rem !important; }
          .hero-title    { font-size: clamp(3rem, 13vw, 4.5rem) !important; }
          .hero-tagline  { font-size: 0.9rem !important; }
          .hero-buttons  { flex-direction: column !important; align-items: stretch !important; }
          .hero-buttons button { text-align: center !important; justify-content: center !important; }
        }
      `}</style>

      <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#04040f' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} intensity={2} color="#6d28d9" />
            <pointLight position={[-5, -3, 2]} intensity={1.5} color="#06b6d4" />
            <pointLight position={[0, 0, 4]} intensity={0.5} color="#ffffff" />
            <Suspense fallback={null}>
              <Environment preset="night" />
              <Stars radius={60} depth={50} count={3000} factor={3} saturation={0.5} fade speed={0.4} />
              <Orb /><Ring /><RingOuter /><Particles />
            </Suspense>
            <CameraRig />
          </Canvas>
        </div>

        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, #04040f 100%)' }} />

        <div className="hero-content" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div variants={container} initial="hidden" animate="show" style={{ maxWidth: '620px' }}>
            <motion.h1 className="hero-title" variants={item} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '1.75rem' }}>
              Om<br />
              <span style={{ background: 'linear-gradient(135deg, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Parida.</span>
            </motion.h1>

            <motion.p className="hero-tagline" variants={item} style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.75, color: '#94a3b8', fontWeight: 300, maxWidth: '480px', marginBottom: '2.5rem' }}>
              Full-stack developer obsessed with immersive interfaces, 3D web experiences, and code that performs as good as it looks.
            </motion.p>

            <motion.div variants={item} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '3rem' }}>
              {roles.map(role => (
                <span key={role} style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 500, padding: '0.45rem 1rem', borderRadius: '999px', border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.07)', color: '#c4b5fd', letterSpacing: '0.03em' }}>
                  {role}
                </span>
              ))}
            </motion.div>

            <motion.div className="hero-buttons" variants={item} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ padding: '0.9rem 2.2rem', fontSize: '0.82rem', fontFamily: 'var(--font-body)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#ffffff', background: 'linear-gradient(135deg, #7c3aed, #4f1d96)', border: 'none', borderRadius: '6px', cursor: 'none', transition: 'all 0.3s', boxShadow: '0 0 28px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 0 45px rgba(124,58,237,0.75)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = '0 0 28px rgba(124,58,237,0.5)' }}
              >View My Work</button>
              <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ padding: '0.9rem 2.2rem', fontSize: '0.82rem', fontFamily: 'var(--font-body)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#a78bfa', background: 'transparent', border: '1px solid rgba(167,139,250,0.35)', borderRadius: '6px', cursor: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#a78bfa'; el.style.background = 'rgba(167,139,250,0.08)'; el.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(167,139,250,0.35)'; el.style.background = 'transparent'; el.style.transform = '' }}
              >Get In Touch</button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: '#334155' }}>scroll</span>
          <motion.div animate={{ scaleY: [1, 0.4, 1], opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '1px', height: '48px', transformOrigin: 'top', background: 'linear-gradient(to bottom, #7c3aed, transparent)' }} />
        </motion.div>
      </section>
    </>
  )
}
