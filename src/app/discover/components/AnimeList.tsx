// DEPRECATED: Was used in the original list-based discover flow where users picked
// from a scrollable list then navigated to a detail view. Replaced by DiscoverStack.tsx,
// which renders an all-in-one card carousel with details and save inline.
import { Anime } from '../types/anime'
import ResultCard from './ResultCard'
type AnimeListProps = {
  animeList: Anime[]
  loading: boolean
  error: string | null
  onSelect: (id: number) => void
}

export default function AnimeList({
  animeList,
  loading,
  error,
  onSelect,
}: AnimeListProps) {
  if (loading) {
    return (
      <div className="animate-pulse text-gray-400">
        Curating recommendations...
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="text-black space-y-2">
      {animeList.map((anime) => (
        <ResultCard
          key={anime.id}
          anime={anime}
          onClick={() => onSelect(anime.id)}
        />
      ))}
    </div>
  )
}
