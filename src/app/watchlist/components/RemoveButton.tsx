type RemoveButtonProps = {
  onClick: () => void
  isPending: boolean
}

export function RemoveButton({ onClick, isPending }: RemoveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className="min-h-10 flex-1 rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-500/20 disabled:opacity-50"
    >
      {isPending ? 'Removing...' : 'Remove'}
    </button>
  )
}
