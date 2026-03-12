'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible,  setVisible]  = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // ALL THREE use identical spring — no trailing at all
  const x = useSpring(mouseX, { stiffness: 3000, damping: 80, mass: 0.1 })
  const y = useSpring(mouseY, { stiffness: 3000, damping: 80, mass: 0.1 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!visible) setVisible(true)
    }
    const onLeave     = () => setVisible(false)
    const onEnter     = () => setVisible(true)
    const onMouseDown = () => setClicking(true)
    const onMouseUp   = () => setClicking(false)
    const onHover = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovering(!!(t.closest('a') || t.closest('button') || t.closest('[data-cursor-hover]')))
    }

    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mousemove',  onHover)
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown',  onMouseDown)
    window.addEventListener('mouseup',    onMouseUp)
    document.documentElement.style.cursor = 'none'

    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mousemove',  onHover)
      window.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown',  onMouseDown)
      window.removeEventListener('mouseup',    onMouseUp)
      document.documentElement.style.cursor = ''
    }
  }, [mouseX, mouseY, visible])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null

  return (
    <div ref={cursorRef} style={{ pointerEvents: 'none', zIndex: 99999, position: 'fixed', inset: 0 }}>

      {/* Single anchor point — everything stacked at exact cursor position */}
      <motion.div style={{
        position: 'fixed',
        left: x,
        top: y,
        x: '-50%',
        y: '-50%',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
      }}>

        {/* Glow — outermost, blurred halo */}
        <motion.div
          animate={{
            width:   hovering ? 200 : clicking ? 70 : 130,
            height:  hovering ? 200 : clicking ? 70 : 130,
            opacity: hovering ? 0.6 : clicking ? 0.75 : 0.5,
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,1) 0%, rgba(6,182,212,0.5) 50%, transparent 70%)',
            filter: 'blur(20px)',
            mixBlendMode: 'screen',
          }}
        />

        {/* Ring — sits right on top of the glow */}
        <motion.div
          animate={{
            width:       hovering ? 48 : clicking ? 14 : 28,
            height:      hovering ? 48 : clicking ? 14 : 28,
            borderColor: hovering ? '#06b6d4' : 'rgba(196,181,253,0.95)',
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '1.5px solid rgba(196,181,253,0.95)',
            mixBlendMode: 'screen',
          }}
        />

        {/* Dot — sharp center, always on top */}
        <motion.div
          animate={{
            width:      hovering ? 4 : clicking ? 2 : 4,
            height:     hovering ? 4 : clicking ? 2 : 4,
            background: hovering ? '#06b6d4' : '#e9d5ff',
            boxShadow:  hovering
              ? '0 0 8px 2px rgba(6,182,212,1)'
              : '0 0 6px 2px rgba(233,213,255,1)',
          }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
          }}
        />

      </motion.div>
    </div>
  )
}
