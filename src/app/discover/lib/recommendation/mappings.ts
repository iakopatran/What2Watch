import type { Mood } from '../../types/mood'
import type {
  CandidateFormat,
  DiscoveryStyle,
  TimeCommitment,
} from '../../types/recommendation'

export type MoodSignals = {
  preferredGenres: readonly string[]
  preferredTags: readonly string[]
}

export const moodSignals: Record<Mood, MoodSignals> = {
  hype: {
    preferredGenres: ['Action', 'Sports'],
    preferredTags: ['Super Power', 'Martial Arts'],
  },
  chill: {
    preferredGenres: ['Slice of Life', 'Comedy'],
    preferredTags: ['Iyashikei'],
  },
  dark: {
    preferredGenres: ['Psychological', 'Thriller', 'Horror'],
    preferredTags: ['Revenge', 'Survival'],
  },
  emotional: {
    preferredGenres: ['Drama', 'Romance'],
    preferredTags: ['Tragedy', 'Family Life'],
  },
}

export type EpisodeRange = {
  min?: number
  max?: number
}

export type TimeCommitmentRule = {
  preferredFormats: readonly CandidateFormat[]
  episodes?: EpisodeRange
}

export const timeCommitmentRules: Record<
  TimeCommitment,
  TimeCommitmentRule
> = {
  quick: {
    preferredFormats: ['TV', 'TV_SHORT', 'ONA', 'OVA'],
    episodes: { min: 1, max: 13 },
  },
  medium: {
    preferredFormats: ['TV'],
    episodes: { min: 14, max: 26 },
  },
  binge: {
    preferredFormats: ['TV'],
    episodes: { min: 27 },
  },
  movie: {
    preferredFormats: ['MOVIE'],
  },
}

export type DiscoveryStyleRule = {
  minimumAverageScore?: number
  popularityPreference: 'reward-high' | 'reward-low' | 'ignore'
}

export const discoveryStyleRules: Record<
  DiscoveryStyle,
  DiscoveryStyleRule
> = {
  popular: {
    popularityPreference: 'reward-high',
  },
  highRated: {
    minimumAverageScore: 75,
    popularityPreference: 'ignore',
  },
  hiddenGem: {
    minimumAverageScore: 68,
    popularityPreference: 'reward-low',
  },
  surpriseMe: {
    popularityPreference: 'ignore',
  },
}
