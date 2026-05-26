// DEPRECATED: Was the detail view shown after selecting an item from AnimeList.
// Replaced by DiscoverStack.tsx, which embeds cover image, score, description,
// and the save button directly into each card — no separate detail step needed.
import { AnimeDetails } from '@/app/shared/types/animeDetails'
import { SaveButton } from './SaveButton'
import { stripHtml } from '@/app/shared/lib/stripHtml'

type DetailCardProps = {
  animeDetails: AnimeDetails | null
  loading: boolean
  error: string | null
  onBack: () => void
  onSave: () => void
  isSaving: boolean
  isSaved: boolean
}

export default function DetailCard({
  animeDetails,
  loading,
  error,
  onBack,
  onSave,
  isSaving,
  isSaved,
}: DetailCardProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      {loading && <p>Loading details...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {animeDetails && (
        <>
          <h2 className="text-2xl font-bold">{animeDetails.title.romaji}</h2>

          <p className="mt-4 max-w-xl text-center">
            {stripHtml(animeDetails.description)}
          </p>

          <p className="mt-2">Score: {animeDetails.averageScore}</p>
          <SaveButton onClick={onSave} isPending={isSaving} isSuccess={isSaved} />
        </>
      )}

      <button
        onClick={onBack}
        className="mt-6 px-4 py-2 bg-gray-200 text-black rounded"
      >
        Back
      </button>
    </div>
  )
}
