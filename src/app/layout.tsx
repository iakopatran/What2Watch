import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import Providers from './providers'
import Navbar from './shared/components/Navbar'

type Props = {
  children: ReactNode
}

export const metadata: Metadata = {
  title: 'What2Watch | Anime recommendations',
  description: 'Questionnaire-driven anime recommendations and watchlist.',
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
