import { useQuery } from '@tanstack/react-query'
import { fetchMultipleDetails } from '@/app/shared/lib/multipleanidetails'

export function useDiscoverDetails(ids: number[]) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['discoverDetails', ...ids],
    queryFn: () => fetchMultipleDetails(ids),
    enabled: ids.length > 0,
  })
  return {
    details: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  }
}
