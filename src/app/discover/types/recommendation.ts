import type { Mood } from './mood'

export const timeCommitments = ['quick', 'medium', 'binge', 'movie'] as const
export type TimeCommitment = (typeof timeCommitments)[number]

export const discoveryStyles = [
  'popular',
  'highRated',
  'hiddenGem',
  'surpriseMe',
] as const
export type DiscoveryStyle = (typeof discoveryStyles)[number]

export type RecommendationPreferences = {
  mood: Mood
  timeCommitment: TimeCommitment
  discoveryStyle: DiscoveryStyle
  includeGenres: string[]
  avoidGenres: string[]
  avoidTags: string[]
}

export const defaultRecommendationPreferences: RecommendationPreferences = {
  mood: 'hype',
  timeCommitment: 'quick',
  discoveryStyle: 'highRated',
  includeGenres: [],
  avoidGenres: [],
  avoidTags: [],
}

export type CandidateFormat =
  | 'TV'
  | 'TV_SHORT'
  | 'MOVIE'
  | 'SPECIAL'
  | 'OVA'
  | 'ONA'
  | 'MUSIC'

export type CandidateTag = {
  name: string
  rank: number | null
  isMediaSpoiler: boolean | null
}

export type CandidateAnime = {
  id: number
  title: {
    romaji: string
  }
  description: string | null
  genres: string[]
  tags: CandidateTag[]
  averageScore: number | null
  popularity: number | null
  episodes: number | null
  format: CandidateFormat | null
  coverImage: {
    medium: string | null
    large: string | null
  }
}

export type ScoreReasonSource =
  | 'mood'
  | 'timeCommitment'
  | 'discoveryStyle'
  | 'includedGenre'
  | 'avoidedGenre'
  | 'avoidedTag'
  | 'quality'

export type ScoreReason = {
  source: ScoreReasonSource
  points: number
  message: string
}

export type ScoreContribution = {
  points: number
  reasons: ScoreReason[]
}

export type ScoredAnime = CandidateAnime & {
  score: number
  reasons: ScoreReason[]
}
