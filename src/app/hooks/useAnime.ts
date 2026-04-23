import { fetchAnimeByMood } from "@/app/lib/anilist"
import { Mood } from "@/app/types/mood"
import {
  useQuery
} from '@tanstack/react-query'
export function useAnime(mood: Mood | null) {
  const {
    data,
    isLoading,
    isFetching,
    error,

  } = useQuery({
    queryKey: ['anime', mood],
    queryFn: () => fetchAnimeByMood(mood!),
    enabled: mood !== null,
    staleTime: 1000 * 60 * 5,
  })



  return {
    animeList: data ?? [],
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,

  }
}