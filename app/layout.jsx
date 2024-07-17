'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Providers from './Providers'
import { SessionProvider } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Providers>
            <Nav />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </Providers>
        </SessionProvider>
      </body>
    </html>
  )
}