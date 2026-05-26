'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useWatchlist } from '@/app/shared/hooks/useWatchlist'
import { useWatchlistDetails } from '../hooks/useWatchlistDetails'
import { useRemoveFromWatchlist } from '../hooks/useRemoveFromWatchlist'
import { WatchlistCardPreview } from './WatchlistCardPreview'
import { WatchlistCard } from './WatchlistCard'

export function Watchlist() {
  const { watchlist, isLoading, error } = useWatchlist()
  const {
    details,
    isLoading: detailsLoading,
    error: detailsError,
  } = useWatchlistDetails(watchlist ?? [])
  const {
    removeFromWatchlist,
    removingId,
    error: removalError,
  } = useRemoveFromWatchlist()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleRemove = (id: number) => {
    removeFromWatchlist(id, {
      onSuccess: () => setSelectedId(null),
    })
  }

  if (isLoading || detailsLoading) {
    return (
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="aspect-[2/3] animate-pulse rounded-lg border border-zinc-800 bg-zinc-900"
          />
        ))}
      </section>
    )
  }

  if (error || detailsError) {
    return (
      <section className="rounded-lg border border-rose-900 bg-rose-950/30 p-6 text-rose-100">
        Could not load your watchlist: {error ?? detailsError}
      </section>
    )
  }

  if (!watchlist || watchlist.length === 0) {
    return (
      <section className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-950/40 px-6 text-center">
        <h2 className="text-xl font-semibold text-zinc-100">Nothing saved yet</h2>
        <p className="mt-2 text-sm text-zinc-400">Your watchlist is empty.</p>
        <Link
          href="/"
          className="mt-6 rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
        >
          Browse recommendations
        </Link>
      </section>
    )
  }

  const selected = details.find((detail) => detail.id === selectedId)

  return (
    <section>
      <div className="mb-6 flex items-end justify-between border-b border-zinc-800 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase text-emerald-400">Library</p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-50">Saved titles</h2>
        </div>
        <p className="text-sm text-zinc-400">{watchlist.length} saved</p>
      </div>

      {removalError && (
        <p className="mb-4 rounded-md bg-rose-950/40 p-3 text-sm text-rose-200">
          {removalError}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {details.filter((detail) => watchlist.includes(detail.id)).map((animeDetails) => (
          <WatchlistCardPreview
            key={animeDetails.id}
            animeDetails={animeDetails}
            onClick={() => setSelectedId(animeDetails.id)}
          />
        ))}
      </div>

      {selected && (
        <WatchlistCard
          animeDetails={selected}
          onClose={() => setSelectedId(null)}
          onRemove={() => handleRemove(selected.id)}
          isRemoving={removingId === selected.id}
        />
      )}
    </section>
  )
}
