'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-6 px-8 py-4 border-b">
      <Link
        href="/"
        className={pathname === '/' ? 'font-semibold underline' : 'text-gray-500 hover:text-black'}
      >
        Discover
      </Link>
      <Link
        href="/watchlist"
        className={pathname === '/watchlist' ? 'font-semibold underline' : 'text-gray-500 hover:text-black'}
      >
        Watchlist
      </Link>
    </nav>
  )
}
