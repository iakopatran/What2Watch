import { removeFromWatchlist } from "../lib/storage"
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useRemoveFromWatchlist(options?: { onSettled?: () => void }){
    const queryClient = useQueryClient();

    const{
        mutate,
        isPending,
        error,
    } = useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["watchlist"]}),

    })

    return {removeFromWatchlist: mutate, isPending,onSettled: options?.onSettled, error: error instanceof Error ? error.message : null}

}
