import { getWatchlist } from "@/app/api/watchlist"
import {
  useQuery
} from '@tanstack/react-query'

export function useWatchlist(){
  const{
    data,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["watchlist"],
    queryFn: getWatchlist,
  })

  return {
    watchlist: data,
    isLoading,
    error: error instanceof Error ? error.message : null,
  }
}