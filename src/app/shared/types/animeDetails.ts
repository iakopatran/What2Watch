export type AnimeDetails = {
  id: number
  title: {
    romaji: string
  }
  description: string | null
  averageScore: number | null
  genres: string[]
  episodes: number | null
  format: string | null
  coverImage: {
    medium: string | null
    large: string | null
  }
}
