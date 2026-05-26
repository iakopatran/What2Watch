import { moods, Mood } from '../types/mood'

type MoodSelectorProps = {
  setMood: (mood: Mood) => void
  resetMood: () => void
  mood: Mood | null
}

export default function MoodSelector({
  setMood,
  resetMood,
  mood,
}: MoodSelectorProps) {
  return (
    <div className="flex gap-4">
      {moods.map((m) => (
        <button
          key={m}
          onClick={() => setMood(m)}
          className={`px-4 py-2 rounded capitalize ${
            mood === m ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          {m}
        </button>
      ))}

      <button
        onClick={resetMood}
        className="px-4 py-2 bg-gray-500 text-white rounded"
      >
        Reset
      </button>
    </div>
  )
}
