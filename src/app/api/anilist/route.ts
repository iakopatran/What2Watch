export async function POST(req: Request) {
  const { query, variables } = await req.json();

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!res.ok) {
    return new Response("Failed to fetch", { status: res.status });
  }

  const data = await res.json();

  return Response.json(data);
}
