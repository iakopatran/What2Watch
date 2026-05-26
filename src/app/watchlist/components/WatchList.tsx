'use client'

import { useState } from 'react'
import { useWatchlist } from '@/app/shared/hooks/useWatchlist'
import { useWatchlistDetails } from '../hooks/useWatchlistDetails'
import { useRemoveFromWatchlist } from '../hooks/useRemoveFromWatchlist'
import { WatchlistCardPreview } from './WatchlistCardPreview'
import { WatchlistCard } from './WatchlistCard'

export function Watchlist() {
  const { watchlist, isLoading, error } = useWatchlist()
  const { details, isLoading: detailsLoading } = useWatchlistDetails(watchlist ?? [])
  const { removeFromWatchlist } = useRemoveFromWatchlist({
    onSettled: () => setRemovingId(null),
  })
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [removingId, setRemovingId] = useState<number | null>(null)

  const handleRemove = (id: number) => {
    setRemovingId(id)
    removeFromWatchlist(id)
  }

  if (isLoading || detailsLoading) {
    return <div>Loading watchlist...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!watchlist || watchlist.length === 0) {
    return <div>No items in your watchlist.</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Watchlist</h2>
      <div className="flex flex-wrap gap-4">
        {details.filter(d => watchlist?.includes(d.id)).map((animeDetails) => (
          <WatchlistCardPreview
            key={animeDetails.id}
            animeDetails={animeDetails}
            onClick={() => setSelectedId(animeDetails.id)}
          />
        ))}
      </div>
      {selectedId !== null && (() => {
        const selected = details.find(d => d.id === selectedId)
        return selected ? (
          <WatchlistCard
            animeDetails={selected}
            onClose={() => setSelectedId(null)}
            onRemove={() => {
              handleRemove(selectedId)
              setSelectedId(null)
            }}
            isRemoving={removingId === selectedId}
          />
        ) : null
      })()}
    </div>
  )
}
