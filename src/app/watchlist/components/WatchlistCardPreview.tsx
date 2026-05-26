'use client'

import Image from 'next/image'
import { AnimeDetails } from '@/app/shared/types/animeDetails'

type WatchlistCardPreviewProps = {
  animeDetails: AnimeDetails
  onClick: () => void
}

export function WatchlistCardPreview({
  animeDetails,
  onClick,
}: WatchlistCardPreviewProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 text-left transition-colors hover:border-zinc-600"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {animeDetails.coverImage.medium && (
          <Image
            src={animeDetails.coverImage.medium}
            alt={animeDetails.title.romaji}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 180px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="p-3">
        <p className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-zinc-100">
          {animeDetails.title.romaji}
        </p>
        <p className="mt-2 text-xs text-zinc-400">
          {animeDetails.format?.replace('_', ' ') ?? 'Anime'}
          {animeDetails.averageScore ? ` / Score ${animeDetails.averageScore}` : ''}
        </p>
      </div>
    </button>
  )
}
