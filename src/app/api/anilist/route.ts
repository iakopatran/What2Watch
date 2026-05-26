export async function POST(req: Request) {
  try {
    const { query, variables } = await req.json()

    if (typeof query !== 'string') {
      return Response.json({ error: 'A GraphQL query is required.' }, { status: 400 })
    }

    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    if (!res.ok) {
      return Response.json(
        { error: 'AniList request failed.' },
        { status: res.status },
      )
    }

    const data = await res.json()
    return Response.json(data)
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }
}
