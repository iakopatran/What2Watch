import { scoreAnime } from './scoring'
import type {
  CandidateAnime,
  RecommendationPreferences,
  ScoredAnime,
} from '../../types/recommendation'

export function rankAnime(
  candidates: CandidateAnime[],
  preferences: RecommendationPreferences,
  limit = 5,
): ScoredAnime[] {
  return candidates
    .map((anime) => scoreAnime(anime, preferences))
    .sort(
      (left, right) =>
        right.score - left.score ||
        (right.averageScore ?? 0) - (left.averageScore ?? 0) ||
        (right.popularity ?? 0) - (left.popularity ?? 0) ||
        left.id - right.id,
    )
    .slice(0, limit)
}
