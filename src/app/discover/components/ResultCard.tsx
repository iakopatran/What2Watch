// DEPRECATED: Was a list item in the original AnimeList-based discover flow.
// Both this and AnimeList.tsx were replaced by DiscoverStack.tsx, which handles
// display and selection in a single card carousel component.
import { Anime } from '../types/anime'

type ResultCardProps = {
  anime: Anime
  onClick: () => void
}

export default function ResultCard({ anime, onClick }: ResultCardProps) {
  return (
    <div onClick={onClick} className="bg-gray-100 p-3 rounded cursor-pointer">
      {anime.title.romaji}
    </div>
  )
}
