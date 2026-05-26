'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold text-zinc-50">
          What<span className="text-emerald-400">2</span>Watch
        </Link>
        <div className="flex h-full items-center gap-1">
          <Link
            href="/"
            className={`flex h-full items-center border-b-2 px-4 text-sm font-medium transition-colors ${
              pathname === '/'
                ? 'border-emerald-400 text-zinc-50'
                : 'border-transparent text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Discover
          </Link>
          <Link
            href="/watchlist"
            className={`flex h-full items-center border-b-2 px-4 text-sm font-medium transition-colors ${
              pathname === '/watchlist'
                ? 'border-emerald-400 text-zinc-50'
                : 'border-transparent text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Watchlist
          </Link>
        </div>
      </nav>
    </header>
  )
}
