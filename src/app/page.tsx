'use client'

import { useState } from 'react'

import { useAnime } from '@/app/hooks/useAnime'
import { useAnimeDetails } from '@/app/hooks/useAnimeDetails'
import { Mood } from '@/app/types/mood'

import MoodSelector from '@/app/components/MoodSelector'
import DetailCard from '@/app/components/DetailCard'
import AnimeList from './components/AnimeList'

export default function Home() {
  const [mood, setMood] = useState<Mood | null>(null)
  const [selectedAnime, setSelectedAnime] = useState<number | null>(null)
  const resetMood = () => setMood(null)

  //Hooks
  const { animeList, isLoading, isFetching, error } = useAnime(mood)
  const {
    animeDetails: animeDetails,
    isLoading: detailsLoading,
    error: detailsError,
  } = useAnimeDetails(selectedAnime)

  const handleMoodSelect = (m: Mood) => {
    setMood(m)
  }

  console.log('effect:', selectedAnime)

  return selectedAnime !== null ? (
    <DetailCard
      animeDetails={animeDetails}
      loading={detailsLoading}
      error={detailsError}
      onBack={() => setSelectedAnime(null)}
    />
  ) : (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-center">
          What should I watch tonight?
        </h1>

        <MoodSelector
          setMood={handleMoodSelect}
          resetMood={resetMood}
          mood={mood}
        />
      </div>

      {mood && (
        <AnimeList
          animeList={animeList}
          loading={isLoading}
          error={error}
          onSelect={setSelectedAnime}
        />
      )}
      {isFetching && !isLoading && (
        <div className="text-sm text-gray-400">Updating...</div>
      )}

      {mood && !isLoading && !error && animeList.length === 0 && (
        <div>No results found</div>
      )}
    </main>
  )
}
