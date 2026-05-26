import React from 'react'
import './globals.css'
import Providers from './providers'
import Navbar from './shared/components/Navbar'

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html>
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
