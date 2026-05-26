'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AnimeDetails } from '@/app/shared/types/animeDetails'
import { RemoveButton } from './RemoveButton'
import { stripHtml } from '@/app/shared/lib/stripHtml'

function StarRating() {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)

  return (
    <div className="pt-4 pb-1">
      <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2">Your Rating</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star === rating ? 0 : star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={`text-2xl transition-colors ${
              star <= (hovered || rating) ? 'text-amber-400' : 'text-zinc-600'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}

type AccordionItemProps = {
  label: string
  children: React.ReactNode
}

function AccordionItem({ label, children }: AccordionItemProps) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center py-2.5 border-b border-zinc-700 text-zinc-300 text-sm font-medium hover:text-white transition-colors"
      >
        <span>{label}</span>
        <span className="text-zinc-500 text-xs">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="py-3">{children}</div>}
    </div>
  )
}

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
  const description = stripHtml(animeDetails.description)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-2xl overflow-hidden max-w-xl w-full mx-4 flex flex-row shadow-2xl h-96"
        onClick={(e) => e.stopPropagation()}
      >
        {animeDetails.coverImage?.large && (
          <div className="relative w-52 shrink-0">
            <Image
              src={animeDetails.coverImage.large}
              alt={animeDetails.title.romaji}
              fill
              sizes="208px"
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col p-5 flex-1 min-w-0">
          <h2 className="text-white text-lg font-bold leading-tight">{animeDetails.title.romaji}</h2>
          <span className="inline-flex items-center gap-1 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full self-start mt-2">
            ★ {animeDetails.averageScore}
          </span>

          <div className="flex-1 min-h-0 overflow-y-auto mt-4">
            <AccordionItem label="Description">
              <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
            </AccordionItem>
            <AccordionItem label="Notes">
              <p className="text-zinc-500 text-sm italic">No notes added.</p>
            </AccordionItem>
            <StarRating />
          </div>

          <div className="flex gap-2 mt-3">
            <RemoveButton onClick={onRemove} isPending={isRemoving} />
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
