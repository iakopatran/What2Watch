// DEPRECATED: Fetched a single anime's details with one GraphQL query per call.
// Replaced by multipleanidetails.ts, which batches all IDs into a single query
// to avoid N individual requests.
import { AnimeDetails } from "@/app/shared/types/animeDetails";

export async function fetchDetails(selectedAnime: number): Promise<AnimeDetails> {
  const query = `
    query ($id: Int) {
      Media(id: $id) {
        id
        title {
          romaji
        }
        description
        averageScore
        coverImage {
          medium
          large
        }
      }
    }
  `;
const res = await fetch("/api/anilist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { id: selectedAnime },
    }),
  });

  const data = await res.json();

  return data.data.Media;
}
