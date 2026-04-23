import { AnimeDetails } from "../types/animeDetails";

export async function fetchDetails(selectedAnime: number): Promise<AnimeDetails> {
  const query = `
    query ($id: Int) {
      Media(id: $id) {
        title {
          romaji
              }
        description
        averageScore
        }
      }
  `;
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { id: selectedAnime },
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  const data = await res.json();

  if (data.errors) {
    throw new Error("GraphQL error");
  }

  return data.data.Media;
}
