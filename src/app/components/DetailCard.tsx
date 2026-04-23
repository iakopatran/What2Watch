import { AnimeDetails } from '@/app/types/animeDetails'

type DetailCardProps = {
  animeDetails: AnimeDetails | null
  loading: boolean
  error: string | null
  onBack: () => void
}
export default function DetailCard({
  animeDetails,
  loading,
  error,
  onBack,
}: DetailCardProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      {loading && <p>Loading details...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {animeDetails && (
        <>
          <h2 className="text-2xl font-bold">{animeDetails.title.romaji}</h2>

          <p className="mt-4 max-w-xl text-center">
            {animeDetails.description}
          </p>

          <p className="mt-2">Score: {animeDetails.averageScore}</p>
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
