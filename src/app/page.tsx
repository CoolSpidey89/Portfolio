'use client'

import Navbar          from '@/components/Navbar'
import Hero            from '@/components/Hero'
import About           from '@/components/About'
import Projects        from '@/components/Projects'
import Skills          from '@/components/Skills'
import Certifications  from '@/components/Certifications'
import Contact         from '@/components/Contact'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Certifications />
      <Contact />
    </main>
  )
}
