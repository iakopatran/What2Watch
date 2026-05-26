import { AnimeDetails } from "@/app/shared/types/animeDetails";

export async function fetchMultipleDetails(ids: number[]): Promise<AnimeDetails[]> {
  if (ids.length === 0) return [];

  const fields = `
    id
    title { romaji }
    description
    averageScore
    coverImage { medium large }
  `;

  const query = `
    query (${ids.map((_, i) => `$id${i}: Int`).join(", ")}) {
      ${ids.map((_, i) => `anime${i}: Media(id: $id${i}) { ${fields} }`).join("\n")}
    }
  `;

  const variables = Object.fromEntries(ids.map((id, i) => [`id${i}`, id]));

  const res = await fetch("/api/anilist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const data = await res.json();

  return ids.map((_, i) => data.data[`anime${i}`]);
}
