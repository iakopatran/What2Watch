import { addToWatchlist } from "@/app/api/watchlist"
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAddToWatchlist(){
    const queryClient = useQueryClient();

    const{
    mutate,
    isPending,
    error,
    } = useMutation({
    mutationFn: addToWatchlist,
    onSuccess: () => queryClient.invalidateQueries(["watchlist"]),
    })

    return {mutate, isPending, error}

}