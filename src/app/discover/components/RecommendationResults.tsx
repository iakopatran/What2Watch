import Image from 'next/image'
import { stripHtml } from '@/app/shared/lib/stripHtml'
import type { ScoredAnime } from '../types/recommendation'
import { SaveButton } from './SaveButton'

type RecommendationResultsProps = {
  recommendations: ScoredAnime[]
  onSave: (id: number) => void
  savingId: number | null
  watchlist: number[]
  hasSearched: boolean
  isLoading: boolean
  error: string | null
}

function formatFormat(format: ScoredAnime['format']) {
  return format?.replace('_', ' ') ?? 'Series'
}

export function RecommendationResults({
  recommendations,
  onSave,
  savingId,
  watchlist,
  hasSearched,
  isLoading,
  error,
}: RecommendationResultsProps) {
  if (!hasSearched) {
    return (
      <section className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-950/40 px-8 text-center">
        <div>
          <p className="text-sm font-medium text-zinc-500">Ready for tonight</p>
          <p className="mt-2 text-xl font-semibold text-zinc-200">
            Recommendations will appear here
          </p>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-[330px] animate-pulse rounded-lg border border-zinc-800 bg-zinc-900"
          />
        ))}
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-lg border border-rose-900 bg-rose-950/30 p-6 text-rose-100">
        <h2 className="text-lg font-semibold">Could not load recommendations</h2>
        <p className="mt-2 text-sm text-rose-200">{error}</p>
      </section>
    )
  }

  if (recommendations.length === 0) {
    return (
      <section className="rounded-lg border border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-300">
        No matches returned for this profile.
      </section>
    )
  }

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-emerald-400">
            Ranked results
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-50">
            Your matches
          </h2>
        </div>
        <span className="text-sm text-zinc-500">
          {recommendations.length} picks
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {recommendations.map((anime, index) => (
          <article
            key={anime.id}
            className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950"
          >
            <div className="flex h-full flex-col sm:min-h-[320px] sm:flex-row">
              <div className="relative aspect-[16/10] w-full shrink-0 sm:aspect-auto sm:w-40">
                {anime.coverImage.large && (
                  <Image
                    src={anime.coverImage.large}
                    alt={anime.title.romaji}
                    fill
                    sizes="(max-width: 640px) 128px, 160px"
                    className="object-cover"
                  />
                )}
                <span className="absolute left-3 top-3 rounded-md bg-zinc-950/90 px-2 py-1 text-xs font-semibold text-zinc-100">
                  #{index + 1}
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold leading-snug text-zinc-50">
                    {anime.title.romaji}
                  </h3>
                  <span className="shrink-0 rounded-md bg-emerald-400/15 px-2 py-1 text-xs font-semibold text-emerald-200">
                    {anime.score} pts
                  </span>
                </div>

                <p className="mt-2 text-xs text-zinc-400">
                  {formatFormat(anime.format)}
                  {anime.episodes ? ` / ${anime.episodes} eps` : ''}
                  {anime.averageScore ? ` / Score ${anime.averageScore}` : ''}
                </p>

                {anime.description && (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                    {stripHtml(anime.description)}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {anime.genres.slice(0, 3).map((genre) => (
                    <span
                      key={genre}
                      className="rounded bg-zinc-800 px-2 py-1 text-[11px] text-zinc-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                <ul className="mt-3 flex-1 space-y-1.5">
                  {anime.reasons.slice(0, 3).map((reason) => (
                    <li
                      key={`${reason.source}-${reason.message}`}
                      className={`text-xs ${
                        reason.points < 0 ? 'text-rose-300' : 'text-emerald-200'
                      }`}
                    >
                      {reason.points > 0 ? '+' : ''}
                      {reason.points} {reason.message}
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <SaveButton
                    onClick={() => onSave(anime.id)}
                    isPending={savingId === anime.id}
                    isSuccess={watchlist.includes(anime.id)}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
