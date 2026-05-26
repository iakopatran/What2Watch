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
      className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
        isSuccess
          ? 'bg-emerald-600 text-white'
          : 'bg-zinc-900 hover:bg-zinc-700 text-white'
      }`}
    >
      {isPending ? 'Saving...' : isSuccess ? 'Saved ✓' : 'Add to Watchlist'}
    </button>
  )
}
