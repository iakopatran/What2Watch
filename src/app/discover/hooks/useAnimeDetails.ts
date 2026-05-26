// DEPRECATED: Fetched details for a single selected anime on demand.
// Replaced by useDiscoverDetails.ts, which batch-fetches details for all anime
// in the current mood list at once via multipleanidetails.ts.
import { fetchDetails } from "@/app/shared/lib/anidetail";
import { useQuery } from '@tanstack/react-query'

export function useAnimeDetails(selectedAnime: number | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['animeDetails', selectedAnime],
    queryFn: () => fetchDetails(selectedAnime!),
    enabled: selectedAnime !== null
  })

  return {
    animeDetails: data ?? null,
    isLoading,
    error: error instanceof Error ? error.message : null,
  }
}
