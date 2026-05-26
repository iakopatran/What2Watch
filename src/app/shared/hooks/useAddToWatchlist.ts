import { addToWatchlist } from '@/app/watchlist/lib/storage'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useAddToWatchlist() {
  const queryClient = useQueryClient()

  const { mutate, variables, isPending, isSuccess, error } = useMutation({
    mutationFn: addToWatchlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] }),
  })

  return {
    addToWatchlist: mutate,
    savingId: isPending ? (variables ?? null) : null,
    isSuccess,
    error: error instanceof Error ? error.message : null,
  }
}
