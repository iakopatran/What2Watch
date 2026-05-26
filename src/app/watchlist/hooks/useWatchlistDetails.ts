import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchMultipleDetails } from '@/app/shared/lib/multipleanidetails'

export function useWatchlistDetails(ids: number[]) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['watchlistDetails', ...ids],
    queryFn: () => fetchMultipleDetails(ids),
    enabled: ids.length > 0,
    placeholderData: keepPreviousData,
  })

  return {
    details: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  }
}
