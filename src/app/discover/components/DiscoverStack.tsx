'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimeDetails } from '@/app/shared/types/animeDetails'
import { SaveButton } from './SaveButton'

type DiscoverStackProps = {
  details: AnimeDetails[]
  onSave: (id: number) => void
  onClose: () => void
  savingId: number | null
  watchlist: number[]
}

export function DiscoverStack({ details, onSave, onClose, savingId, watchlist }: DiscoverStackProps) {
  const [index, setIndex] = useState(0)

  if (details.length === 0) return null

  const current = details[index]
  const isSaved = watchlist.includes(current.id)
  const isSaving = savingId === current.id

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="flex items-center gap-6" onClick={(e) => e.stopPropagation()}>

        <button
          onClick={() => setIndex(i => i - 1)}
          disabled={index === 0}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl disabled:opacity-20 transition-all"
        >
          ‹
        </button>

        <div className="bg-zinc-900 rounded-3xl overflow-hidden w-64 shadow-2xl">
          {current.coverImage?.large && (
            <div className="relative w-full h-80">
              <Image
                src={current.coverImage.large}
                alt={current.title.romaji}
                fill
                sizes="256px"
                className="object-cover"
              />
            </div>
          )}
          <div className="p-5 flex flex-col gap-3">
            <h2 className="text-white text-lg font-bold leading-tight">{current.title.romaji}</h2>
            <span className="inline-flex items-center gap-1 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full self-start">
              ★ {current.averageScore}
            </span>
            <SaveButton
              onClick={() => onSave(current.id)}
              isPending={isSaving}
              isSuccess={isSaved}
            />
          </div>
        </div>

        <button
          onClick={() => setIndex(i => i + 1)}
          disabled={index === details.length - 1}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl disabled:opacity-20 transition-all"
        >
          ›
        </button>

      </div>

      <div className="flex gap-2 mt-6" onClick={(e) => e.stopPropagation()}>
        {details.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-zinc-600'}`}
          />
        ))}
      </div>
    </div>
  )
}
