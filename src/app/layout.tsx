import { ClientLayout } from '@/layout/ClientLayout'
import { ReduxProvider } from '@/store/ReduxProvider'
import { Layout } from 'lucide-react'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

// Configuration des polices avec optimisation
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Relational Partner Manager',
  description: 'Application de gestion des relations partenariales',
  keywords: ['partenaires', 'gestion', 'relations'],
  authors: [{ name: 'Thiesset Fabien' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

interface RootLayoutProps {
  readonly children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='fr' className='dark'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-dvh`}
      >
        <ReduxProvider>
          <ClientLayout>{children}</ClientLayout>
        </ReduxProvider>
      </body>
    </html>
  )
}

Layout.displayName = 'Layout'
