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
    <div
      onClick={onClick}
      className="relative w-40 h-40 rounded flex items-end overflow-hidden cursor-pointer transition-transform hover:scale-105"
    >
      {animeDetails.coverImage?.medium && (
        <Image
          src={animeDetails.coverImage.medium}
          alt={animeDetails.title.romaji}
          fill
          sizes="160px"
          className="object-cover"
        />
      )}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/70 to-transparent" />
      <div className="relative w-full p-2">
        <p className="text-white text-sm font-bold leading-tight line-clamp-2 text-center">
          {animeDetails.title.romaji}
        </p>
      </div>
    </div>
  )
}
