import { removeFromWatchlist } from '../lib/storage'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useRemoveFromWatchlist(options?: { onSettled?: () => void }) {
  const queryClient = useQueryClient()

  const { mutate, variables, isPending, error } = useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] }),
    onSettled: options?.onSettled,
  })

  return {
    removeFromWatchlist: mutate,
    removingId: isPending ? (variables ?? null) : null,
    error: error instanceof Error ? error.message : null,
  }
}
