import { moodSignals } from './mappings'
import type {
  CandidateFormat,
  DiscoveryStyle,
  RecommendationPreferences,
} from '../../types/recommendation'

type CandidateSort = 'POPULARITY_DESC' | 'SCORE_DESC' | 'TRENDING_DESC'

export type CandidateQueryVariables = {
  perPage: number
  genres: string[]
  formats?: CandidateFormat[]
  sort: CandidateSort[]
}

const styleSort: Record<DiscoveryStyle, CandidateSort[]> = {
  popular: ['POPULARITY_DESC'],
  highRated: ['SCORE_DESC', 'POPULARITY_DESC'],
  hiddenGem: ['SCORE_DESC'],
  surpriseMe: ['TRENDING_DESC', 'SCORE_DESC'],
}

export function buildQueryVariables(
  preferences: RecommendationPreferences,
): CandidateQueryVariables {
  const genres = Array.from(
    new Set([
      ...moodSignals[preferences.mood].preferredGenres,
      ...preferences.includeGenres,
    ]),
  )

  return {
    perPage: 30,
    genres,
    formats:
      preferences.timeCommitment === 'movie' ? ['MOVIE'] : undefined,
    sort: styleSort[preferences.discoveryStyle],
  }
}
