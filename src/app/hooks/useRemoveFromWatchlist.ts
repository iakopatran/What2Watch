import { removeFromWatchlist } from "@/app/api/watchlist"
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useRemoveToWatchlist(){
    const queryClient = useQueryClient();

    const{
    mutate,
    isPending,
    error,
    } = useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: () => queryClient.invalidateQueries(["watchlist"]),
    })

    return {mutate, isPending, error}

}