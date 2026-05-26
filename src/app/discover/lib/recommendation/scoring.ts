import {
  discoveryStyleRules,
  moodSignals,
  timeCommitmentRules,
} from './mappings'
import type {
  CandidateAnime,
  RecommendationPreferences,
  ScoreContribution,
  ScoreReasonSource,
  ScoredAnime,
} from '../../types/recommendation'

function noContribution(): ScoreContribution {
  return {
    points: 0,
    reasons: [],
  }
}

function withReason(
  points: number,
  source: ScoreReasonSource,
  message: string,
): ScoreContribution {
  return {
    points,
    reasons: [{ source, points, message }],
  }
}

function combineContributions(
  contributions: ScoreContribution[],
): ScoreContribution {
  return {
    points: contributions.reduce(
      (total, contribution) => total + contribution.points,
      0,
    ),
    reasons: contributions.flatMap((contribution) => contribution.reasons),
  }
}

export function scoreMoodMatch(
  anime: CandidateAnime,
  preferences: RecommendationPreferences,
): ScoreContribution {
  const signals = moodSignals[preferences.mood]
  const contributions: ScoreContribution[] = []
  const matchedGenre = signals.preferredGenres.find((genre) =>
    anime.genres.includes(genre),
  )

  if (matchedGenre) {
    contributions.push(
      withReason(
        18,
        'mood',
        `Fits your ${preferences.mood} mood through ${matchedGenre}.`,
      ),
    )
  }

  const matchedTag = signals.preferredTags.find((preferredTag) =>
    anime.tags.some(
      (animeTag) =>
        animeTag.name === preferredTag && !animeTag.isMediaSpoiler,
    ),
  )

  if (matchedTag) {
    contributions.push(
      withReason(
        8,
        'mood',
        `Includes the ${matchedTag} theme associated with ${preferences.mood}.`,
      ),
    )
  }

  return combineContributions(contributions)
}

export function scoreTimeCommitment(
  anime: CandidateAnime,
  preferences: RecommendationPreferences,
): ScoreContribution {
  const rule = timeCommitmentRules[preferences.timeCommitment]

  if (preferences.timeCommitment === 'movie') {
    return anime.format === 'MOVIE'
      ? withReason(18, 'timeCommitment', 'A movie-length pick for tonight.')
      : noContribution()
  }

  if (anime.episodes === null || !rule.episodes) {
    return noContribution()
  }

  const fitsMinimum =
    rule.episodes.min === undefined || anime.episodes >= rule.episodes.min
  const fitsMaximum =
    rule.episodes.max === undefined || anime.episodes <= rule.episodes.max

  return fitsMinimum && fitsMaximum
    ? withReason(
        14,
        'timeCommitment',
        `Fits your ${preferences.timeCommitment} watch window at ${anime.episodes} episodes.`,
      )
    : noContribution()
}

export function scoreDiscoveryStyle(
  anime: CandidateAnime,
  preferences: RecommendationPreferences,
): ScoreContribution {
  const rule = discoveryStyleRules[preferences.discoveryStyle]

  if (
    preferences.discoveryStyle === 'popular' &&
    anime.popularity !== null &&
    anime.popularity >= 30000
  ) {
    return withReason(12, 'discoveryStyle', 'A widely watched audience favorite.')
  }

  if (
    preferences.discoveryStyle === 'highRated' &&
    anime.averageScore !== null &&
    anime.averageScore >= (rule.minimumAverageScore ?? 75)
  ) {
    return withReason(14, 'discoveryStyle', 'Meets your high-rated preference.')
  }

  if (
    preferences.discoveryStyle === 'hiddenGem' &&
    anime.averageScore !== null &&
    anime.averageScore >= (rule.minimumAverageScore ?? 68) &&
    anime.popularity !== null &&
    anime.popularity < 30000
  ) {
    return withReason(16, 'discoveryStyle', 'A well-rated, less-seen find.')
  }

  return noContribution()
}

export function scoreIncludedGenres(
  anime: CandidateAnime,
  preferences: RecommendationPreferences,
): ScoreContribution {
  const matchedGenre = preferences.includeGenres.find((genre) =>
    anime.genres.includes(genre),
  )

  if (!matchedGenre) {
    return noContribution()
  }

  return withReason(
    15,
    'includedGenre',
    `Matches your selected genre: ${matchedGenre}.`,
  )
}

export function scoreAvoidedGenres(
  anime: CandidateAnime,
  preferences: RecommendationPreferences,
): ScoreContribution {
  const matchedGenre = preferences.avoidGenres.find((genre) =>
    anime.genres.includes(genre),
  )

  if (!matchedGenre) {
    return noContribution()
  }

  return withReason(
    -50,
    'avoidedGenre',
    `Contains an avoided genre: ${matchedGenre}.`,
  )
}

export function scoreAvoidedTags(
  anime: CandidateAnime,
  preferences: RecommendationPreferences,
): ScoreContribution {
  const matchedTag = preferences.avoidTags.find((avoidTag) =>
    anime.tags.some((animeTag) => animeTag.name === avoidTag),
  )

  if (!matchedTag) {
    return noContribution()
  }

  return withReason(
    -50,
    'avoidedTag',
    `Contains an avoided tag: ${matchedTag}.`,
  )
}

export function scoreQuality(
  anime: CandidateAnime,
): ScoreContribution {
  if (anime.averageScore === null) {
    return noContribution()
  }

  if (anime.averageScore >= 80) {
    return withReason(8, 'quality', 'Strong AniList community score.')
  }

  return anime.averageScore >= 70
    ? withReason(4, 'quality', 'Solid AniList community score.')
    : noContribution()
}

export function scoreAnime(
  anime: CandidateAnime,
  preferences: RecommendationPreferences,
): ScoredAnime {
  const contributions = [
    scoreMoodMatch(anime, preferences),
    scoreTimeCommitment(anime, preferences),
    scoreDiscoveryStyle(anime, preferences),
    scoreIncludedGenres(anime, preferences),
    scoreAvoidedGenres(anime, preferences),
    scoreAvoidedTags(anime, preferences),
    scoreQuality(anime),
  ]

  return {
    ...anime,
    score: contributions.reduce(
      (total, contribution) => total + contribution.points,
      0,
    ),
    reasons: contributions.flatMap((contribution) => contribution.reasons),
  }
}
