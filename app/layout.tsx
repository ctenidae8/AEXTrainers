tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AEX Training — Learn to Run a Three-Agent Stack',
  description: 'Interactive AI coordination training. One facilitator. Four sessions. Hands-on methodology.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
      {children}
    
  )
}

