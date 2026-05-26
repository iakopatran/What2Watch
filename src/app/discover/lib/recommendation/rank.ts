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
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
}

// TODO: Once several anime can receive the same score, decide on a
// deterministic tie-breaker such as average score or original fetch order.
