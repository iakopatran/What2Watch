'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import type { AnimeDetails } from '@/app/shared/types/animeDetails'
import { stripHtml } from '@/app/shared/lib/stripHtml'
import { RemoveButton } from './RemoveButton'

type WatchlistCardProps = {
  animeDetails: AnimeDetails
  onClose: () => void
  onRemove: () => void
  isRemoving: boolean
}

export function WatchlistCard({
  animeDetails,
  onClose,
  onRemove,
  isRemoving,
}: WatchlistCardProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const description = animeDetails.description
    ? stripHtml(animeDetails.description)
    : 'No description available.'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-label={animeDetails.title.romaji}
        className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950 shadow-2xl sm:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-52 w-full shrink-0 sm:h-auto sm:w-64">
          {animeDetails.coverImage.large && (
            <Image
              src={animeDetails.coverImage.large}
              alt={animeDetails.title.romaji}
              fill
              sizes="(max-width: 640px) 100vw, 256px"
              className="object-cover"
            />
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold leading-snug text-zinc-50">
              {animeDetails.title.romaji}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 text-sm text-zinc-400 hover:text-zinc-100"
            >
              Close
            </button>
          </div>

          <p className="mt-3 text-sm text-zinc-400">
            {animeDetails.format?.replace('_', ' ') ?? 'Anime'}
            {animeDetails.episodes ? ` / ${animeDetails.episodes} eps` : ''}
            {animeDetails.averageScore
              ? ` / Score ${animeDetails.averageScore}`
              : ''}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {animeDetails.genres.map((genre) => (
              <span
                key={genre}
                className="rounded bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300"
              >
                {genre}
              </span>
            ))}
          </div>

          <div className="mt-5 min-h-0 flex-1 overflow-y-auto border-t border-zinc-800 pt-4">
            <p className="text-sm leading-relaxed text-zinc-300">{description}</p>
          </div>

          <div className="mt-6 flex gap-3 border-t border-zinc-800 pt-4">
            <RemoveButton onClick={onRemove} isPending={isRemoving} />
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 flex-1 rounded-md bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
            >
              Keep saved
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}
