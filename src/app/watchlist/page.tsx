'use client'

import { Watchlist } from './components/WatchList'

export default function WatchlistPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[1440px] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8 border-b border-zinc-800 pb-7">
        <p className="text-xs font-semibold uppercase text-emerald-400">Watchlist</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-50 sm:text-4xl">
          Your saved picks
        </h1>
      </header>
      <Watchlist />
    </main>
  )
}
