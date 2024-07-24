import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Providers from './Providers'
import SessionWrapper from '@/components/SessionWrapper'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <Providers>
            <Nav />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </Providers>
        </SessionWrapper>
      </body>
    </html>
  )
}