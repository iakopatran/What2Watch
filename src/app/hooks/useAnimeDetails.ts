import { fetchDetails } from "../lib/anidetail";
import {
  useQuery
} from '@tanstack/react-query'

export function useAnimeDetails(selectedAnime: number | null) {
    const { data, isLoading, error } = useQuery({
    queryKey:['animeDetails',selectedAnime],
    queryFn: () => fetchDetails(selectedAnime!),
    enabled: selectedAnime !== null
  })

  return {
    animeDetails: data ?? null,
    isLoading,
    error: error instanceof Error ? error.message : null,
  }
}