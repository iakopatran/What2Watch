import { Anime } from '@/app/types/anime'

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
