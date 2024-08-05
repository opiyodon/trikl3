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
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Trikl3</title>
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    </head>
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