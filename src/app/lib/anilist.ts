import { Anime } from "@/app/types/anime";
import { Mood } from '@/app/types/mood'

export async function fetchAnimeByMood(mood: Mood): Promise<Anime[]> {
  const query = `
    query ($genre: String) {
      Page(perPage: 5) {
        media(genre_in: [$genre], type: ANIME) {
        id
          title {
            romaji
          }
        }
      }
    }
  `;


const genreMap: Record<Mood, string> = {
  hype: "Action",
  chill: "Slice of Life",
  dark: "Psychological",
};

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { genre: genreMap[mood] },
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  const data = await res.json();

  if (data.errors) {
    throw new Error("GraphQL error");
  }

  return data.data.Page.media;
}