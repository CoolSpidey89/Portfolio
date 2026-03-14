import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import CustomCursor from '@/components/CustomCursor'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Your Name — Portfolio',
  description: 'Full-stack developer & creative technologist',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`} style={{ overflowX: 'hidden' }}>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}
