type SaveButtonProps = {
  onClick: () => void
  isPending: boolean
  isSuccess: boolean
}

export function SaveButton({ onClick, isPending, isSuccess }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isPending || isSuccess}
      className={`min-h-10 w-full rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
        isSuccess
          ? 'bg-emerald-400/15 text-emerald-200'
          : 'bg-zinc-100 text-zinc-950 hover:bg-white'
      }`}
    >
      {isPending ? 'Saving...' : isSuccess ? 'Saved' : 'Save to watchlist'}
    </button>
  )
}
