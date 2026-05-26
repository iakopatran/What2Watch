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

export function scoreMoodMatch(
  anime: CandidateAnime,
  preferences: RecommendationPreferences,
): ScoreContribution {
  const signals = moodSignals[preferences.mood]

  // TODO: Award points when genres or tags overlap with `signals`.
  // Hint: start with one simple genre match rule before checking tags.
  // Example return shape:
  // return withReason(20, 'mood', 'Matches your hype mood')
  const matchedGenre = signals.preferredGenres.find((genre) => anime.genres.includes(genre))
  if (matchedGenre) {
    return withReason(
      15,
      'mood',
      `Fits your ${preferences.mood} mood through ${matchedGenre}.`,
    )
  }

  const matchedTag = signals.preferredTags.find((preferredTag) =>
    anime.tags.some((animeTag) => animeTag.name === preferredTag)
  )

  if (matchedTag) {
    return withReason(
      10,
      'mood',
      `Fits your ${preferences.mood} mood through ${matchedTag}.`,
    )
  }

  return noContribution()
}

export function scoreTimeCommitment(
  anime: CandidateAnime,
  preferences: RecommendationPreferences,
): ScoreContribution {
  const rule = timeCommitmentRules[preferences.timeCommitment]

  // TODO: Compare `anime.format` and `anime.episodes` with `rule`.
  // Remember that AniList may provide `null` for an unknown episode count.
  void anime
  void rule

  return noContribution()
}

export function scoreDiscoveryStyle(
  anime: CandidateAnime,
  preferences: RecommendationPreferences,
): ScoreContribution {
  const rule = discoveryStyleRules[preferences.discoveryStyle]

  // TODO: Reward popularity, rating, or lower popularity based on `rule`.
  // Keep `surpriseMe` deterministic for now; it can simply add no points.
  void anime
  void rule

  return noContribution()
}

export function scoreIncludedGenres(
  anime: CandidateAnime,
  preferences: RecommendationPreferences,
): ScoreContribution {

  const matchedGenre = preferences.includeGenres.find((genre) => anime.genres.includes(genre))

  if(!matchedGenre ) {
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

  const matchedGenre = preferences.avoidGenres.find((genre) => anime.genres.includes(genre))

  if(!matchedGenre){
    return noContribution()
  }

  return withReason(
    -40,
    'avoidedGenre',
    `Contains an avoided genre: ${matchedGenre}.`,
  )
}

export function scoreAvoidedTags(
  anime: CandidateAnime,
  preferences: RecommendationPreferences,
): ScoreContribution {

  const matchedTag = preferences.avoidTags.find((avoidTag) =>
    anime.tags.some((animeTag) => animeTag.name === avoidTag))

  if(!matchedTag){
    return noContribution()
  }

  return withReason(
    -25,
    'avoidedTag',
    `Contains an avoided tag: ${matchedTag}.`,
  )

}

export function scoreQuality(
  anime: CandidateAnime,
  preferences: RecommendationPreferences,
): ScoreContribution {
  // TODO: Decide whether every recommendation receives a small score bonus
  // for quality, or whether quality is handled only by discovery style.
  void anime
  void preferences

  return noContribution()
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
    scoreQuality(anime, preferences),
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
