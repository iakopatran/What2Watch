import { useQuery } from '@tanstack/react-query'
import { fetchCandidateAnime } from '../lib/anilist'
import { rankAnime } from '../lib/recommendation/rank'
import type { RecommendationPreferences } from '../types/recommendation'

export function useRecommendations(
  preferences: RecommendationPreferences | null,
) {
  const query = useQuery({
    queryKey: ['recommendations', preferences],
    queryFn: async () => {
      const candidates = await fetchCandidateAnime(preferences!)
      return rankAnime(candidates, preferences!, 8)
    },
    enabled: preferences !== null,
    staleTime: 1000 * 60 * 5,
  })

  return {
    recommendations: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
  }
}
