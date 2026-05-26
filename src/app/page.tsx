'use client'

import { useState } from 'react'

import { useAnime } from '@/app/discover/hooks/useAnime'
import { useDiscoverDetails } from '@/app/discover/hooks/useDiscoverDetails'
import { useAddToWatchlist } from '@/app/shared/hooks/useAddToWatchlist'
import { useWatchlist } from '@/app/shared/hooks/useWatchlist'
import { Mood } from '@/app/discover/types/mood'

import MoodSelector from '@/app/discover/components/MoodSelector'
import { DiscoverStack } from '@/app/discover/components/DiscoverStack'

export default function Home() {
  const [mood, setMood] = useState<Mood | null>(null)

  const { animeList, isLoading } = useAnime(mood)
  const { details, isLoading: detailsLoading } = useDiscoverDetails(animeList.map(a => a.id))
  const { addToWatchlist, savingId } = useAddToWatchlist()
  const { watchlist } = useWatchlist()

  const isReady = mood !== null && !isLoading && !detailsLoading && details.length > 0

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-center">What should I watch tonight?</h1>
        <MoodSelector
          setMood={(m) => setMood(m)}
          resetMood={() => setMood(null)}
          mood={mood}
        />
      </div>

      {mood && (isLoading || detailsLoading) && (
        <p className="text-sm text-zinc-400">Loading...</p>
      )}

      {isReady && (
        <DiscoverStack
          key={mood}
          details={details}
          onSave={addToWatchlist}
          onClose={() => setMood(null)}
          savingId={savingId}
          watchlist={watchlist ?? []}
        />
      )}
    </main>
  )
}
