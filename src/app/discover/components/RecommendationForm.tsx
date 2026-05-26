'use client'

import { useState, type FormEvent } from 'react'
import { moods, type Mood } from '../types/mood'
import {
  discoveryStyles,
  defaultRecommendationPreferences,
  timeCommitments,
  type DiscoveryStyle,
  type RecommendationPreferences,
  type TimeCommitment,
} from '../types/recommendation'

type RecommendationFormProps = {
  onSubmit: (preferences: RecommendationPreferences) => void
  isFetching: boolean
}

const moodLabels: Record<Mood, string> = {
  hype: 'Hype',
  chill: 'Chill',
  dark: 'Dark',
  emotional: 'Emotional',
}

const timeLabels: Record<TimeCommitment, string> = {
  quick: 'Quick',
  medium: 'Medium',
  binge: 'Binge',
  movie: 'Movie',
}

const styleLabels: Record<DiscoveryStyle, string> = {
  popular: 'Popular',
  highRated: 'High rated',
  hiddenGem: 'Hidden gem',
  surpriseMe: 'Surprise me',
}

const genreOptions = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Thriller',
]

const tagOptions = ['Gore', 'Tragedy', 'Body Horror', 'Bullying']

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((entry) => entry !== value)
    : [...values, value]
}

export function RecommendationForm({
  onSubmit,
  isFetching,
}: RecommendationFormProps) {
  const [draft, setDraft] = useState(defaultRecommendationPreferences)

  function toggleIncludedGenre(genre: string) {
    setDraft((current) => ({
      ...current,
      includeGenres: toggleValue(current.includeGenres, genre),
      avoidGenres: current.avoidGenres.filter((entry) => entry !== genre),
    }))
  }

  function toggleAvoidedGenre(genre: string) {
    setDraft((current) => ({
      ...current,
      avoidGenres: toggleValue(current.avoidGenres, genre),
      includeGenres: current.includeGenres.filter((entry) => entry !== genre),
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(draft)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-fit rounded-lg border border-zinc-800 bg-zinc-950 p-5 shadow-sm lg:sticky lg:top-24"
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase text-emerald-400">Match profile</p>
        <h2 className="mt-1 text-xl font-semibold text-zinc-50">
          Tonight&apos;s watch
        </h2>
      </div>

      <fieldset className="mb-6">
        <legend className="mb-3 text-sm font-medium text-zinc-300">Mood</legend>
        <div className="grid grid-cols-2 gap-2">
          {moods.map((mood) => (
            <button
              key={mood}
              type="button"
              aria-pressed={draft.mood === mood}
              onClick={() => setDraft((current) => ({ ...current, mood }))}
              className={`min-h-10 rounded-md border px-3 py-2 text-sm transition-colors ${
                draft.mood === mood
                  ? 'border-emerald-400 bg-emerald-400/15 text-emerald-100'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600'
              }`}
            >
              {moodLabels[mood]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="mb-3 text-sm font-medium text-zinc-300">
          Time commitment
        </legend>
        <div className="grid grid-cols-4 overflow-hidden rounded-md border border-zinc-800">
          {timeCommitments.map((time) => (
            <button
              key={time}
              type="button"
              aria-pressed={draft.timeCommitment === time}
              onClick={() =>
                setDraft((current) => ({ ...current, timeCommitment: time }))
              }
              className={`min-h-11 border-r border-zinc-800 px-1 text-xs last:border-r-0 ${
                draft.timeCommitment === time
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {timeLabels[time]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="mb-3 text-sm font-medium text-zinc-300">
          Discovery style
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {discoveryStyles.map((style) => (
            <label
              key={style}
              className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                draft.discoveryStyle === style
                  ? 'border-amber-400/70 bg-amber-400/10 text-amber-100'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-300'
              }`}
            >
              <input
                type="radio"
                name="discoveryStyle"
                checked={draft.discoveryStyle === style}
                onChange={() =>
                  setDraft((current) => ({
                    ...current,
                    discoveryStyle: style,
                  }))
                }
                className="accent-amber-400"
              />
              {styleLabels[style]}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-5">
        <legend className="mb-3 text-sm font-medium text-zinc-300">
          Prefer genres
        </legend>
        <div className="flex flex-wrap gap-2">
          {genreOptions.map((genre) => (
            <label
              key={`include-${genre}`}
              className={`cursor-pointer rounded-md border px-2.5 py-1.5 text-xs has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-400 ${
                draft.includeGenres.includes(genre)
                  ? 'border-emerald-400 bg-emerald-400/15 text-emerald-100'
                  : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              <input
                type="checkbox"
                checked={draft.includeGenres.includes(genre)}
                onChange={() => toggleIncludedGenre(genre)}
                className="sr-only"
              />
              {genre}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-5">
        <legend className="mb-3 text-sm font-medium text-zinc-300">
          Avoid genres
        </legend>
        <div className="flex flex-wrap gap-2">
          {genreOptions.map((genre) => (
            <label
              key={`avoid-${genre}`}
              className={`cursor-pointer rounded-md border px-2.5 py-1.5 text-xs has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-400 ${
                draft.avoidGenres.includes(genre)
                  ? 'border-rose-400 bg-rose-400/15 text-rose-100'
                  : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              <input
                type="checkbox"
                checked={draft.avoidGenres.includes(genre)}
                onChange={() => toggleAvoidedGenre(genre)}
                className="sr-only"
              />
              {genre}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="mb-3 text-sm font-medium text-zinc-300">
          Avoid tags
        </legend>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => (
            <label
              key={tag}
              className={`cursor-pointer rounded-md border px-2.5 py-1.5 text-xs has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-400 ${
                draft.avoidTags.includes(tag)
                  ? 'border-rose-400 bg-rose-400/15 text-rose-100'
                  : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              <input
                type="checkbox"
                checked={draft.avoidTags.includes(tag)}
                onChange={() =>
                  setDraft((current) => ({
                    ...current,
                    avoidTags: toggleValue(current.avoidTags, tag),
                  }))
                }
                className="sr-only"
              />
              {tag}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isFetching}
        className="min-h-12 w-full rounded-md bg-emerald-500 px-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-70"
      >
        {isFetching ? 'Finding matches...' : 'Find matches'}
      </button>
    </form>
  )
}
