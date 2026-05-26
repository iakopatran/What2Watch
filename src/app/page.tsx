'use client'

import { useState } from 'react'

import { useRecommendations } from '@/app/discover/hooks/useRecommendations'
import { useAddToWatchlist } from '@/app/shared/hooks/useAddToWatchlist'
import { useWatchlist } from '@/app/shared/hooks/useWatchlist'
import {
  defaultRecommendationPreferences,
  type RecommendationPreferences,
} from '@/app/discover/types/recommendation'
import { RecommendationForm } from '@/app/discover/components/RecommendationForm'
import { RecommendationResults } from '@/app/discover/components/RecommendationResults'

export default function Home() {
  const [preferences, setPreferences] =
    useState<RecommendationPreferences>(defaultRecommendationPreferences)
  const { recommendations, isLoading, isFetching, error } =
    useRecommendations(preferences)
  const { addToWatchlist, savingId } = useAddToWatchlist()
  const { watchlist } = useWatchlist()

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8 border-b border-zinc-800 pb-7">
        <p className="text-xs font-semibold uppercase text-emerald-400">Discover</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-50 sm:text-4xl">
          Find tonight&apos;s anime
        </h1>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
        <RecommendationForm onSubmit={setPreferences} isFetching={isFetching} />
        <RecommendationResults
          recommendations={recommendations}
          onSave={addToWatchlist}
          savingId={savingId}
          watchlist={watchlist ?? []}
          hasSearched
          isLoading={isLoading}
          error={error}
        />
      </div>
    </main>
  )
}
