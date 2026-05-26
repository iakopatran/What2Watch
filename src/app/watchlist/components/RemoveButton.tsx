type RemoveButtonProps = {
  onClick: () => void
  isPending: boolean
}

export function RemoveButton({ onClick, isPending }: RemoveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
    >
      {isPending ? 'Removing...' : 'Remove'}
    </button>
  )
}
