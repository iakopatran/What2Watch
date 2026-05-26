import type {
  CandidateAnime,
  RecommendationPreferences,
} from '../types/recommendation'
import { buildQueryVariables } from './recommendation/buildQueryVariables'

type AniListCandidateResponse = {
  data?: {
    Page: {
      media: CandidateAnime[]
    }
  }
  errors?: { message: string }[]
}

const candidateQuery = `
  query Recommendations(
    $perPage: Int
    $genres: [String]
    $formats: [MediaFormat]
    $sort: [MediaSort]
  ) {
    Page(page: 1, perPage: $perPage) {
      media(
        type: ANIME
        isAdult: false
        genre_in: $genres
        format_in: $formats
        sort: $sort
      ) {
        id
        title { romaji }
        description
        genres
        tags { name rank isMediaSpoiler }
        averageScore
        popularity
        episodes
        format
        coverImage { medium large }
      }
    }
  }
`

export async function fetchCandidateAnime(
  preferences: RecommendationPreferences,
): Promise<CandidateAnime[]> {
  const res = await fetch('/api/anilist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: candidateQuery,
      variables: buildQueryVariables(preferences),
    }),
  })

  if (!res.ok) {
    throw new Error(`AniList request failed: ${res.status}`)
  }

  const data: AniListCandidateResponse = await res.json()

  if (data.errors || !data.data) {
    throw new Error(data.errors?.[0]?.message ?? 'AniList returned no data.')
  }

  return data.data.Page.media
}
