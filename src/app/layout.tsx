import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/layout/providers'
export const metadata: Metadata = {
  title: 'ShirmoContent — Content Marketing OS',
  description: 'AI-powered content marketing platform for small businesses',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><Providers>{children}</Providers></body>
    </html>
  )
}

