const WATCHLIST_STORAGE_KEY = 'watchlist'
const WATCHLIST_API_URL = process.env.NEXT_PUBLIC_WATCHLIST_API_URL

type WatchlistResponse = {
  watchlist: number[]
}

function isAnimeId(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}

function isWatchlist(value: unknown): value is number[] {
  return Array.isArray(value) && value.every(isAnimeId)
}

function readLocalWatchlist(): number[] {
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    return isWatchlist(parsed) ? parsed : []
  } catch {
    return []
  }
}

function responseError(payload: unknown): string | null {
  if (
    typeof payload === 'object'
    && payload !== null
    && 'error' in payload
    && typeof payload.error === 'string'
  ) {
    return payload.error
  }

  return null
}

async function requestWatchlist(url: string, options?: RequestInit): Promise<number[]> {
  const response = await fetch(url, {
    cache: 'no-store',
    ...options,
  })

  let payload: unknown

  try {
    payload = await response.json()
  } catch {
    throw new Error('Watchlist service returned invalid JSON.')
  }

  if (!response.ok) {
    throw new Error(responseError(payload) ?? 'Watchlist service request failed.')
  }

  if (
    typeof payload !== 'object'
    || payload === null
    || !('watchlist' in payload)
    || !isWatchlist(payload.watchlist)
  ) {
    throw new Error('Watchlist service returned invalid data.')
  }

  return (payload as WatchlistResponse).watchlist
}

export async function getWatchlist(): Promise<number[]> {
  if (WATCHLIST_API_URL) {
    return requestWatchlist(WATCHLIST_API_URL)
  }

  return readLocalWatchlist()
}

export async function addToWatchlist(id: number): Promise<number[]> {
  if (!isAnimeId(id)) {
    throw new Error('Invalid anime ID.')
  }

  if (WATCHLIST_API_URL) {
    return requestWatchlist(WATCHLIST_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anime_id: id }),
    })
  }

  const watchlist = readLocalWatchlist()
  if (watchlist.includes(id)) return watchlist

  const updated = [...watchlist, id]
  localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export async function removeFromWatchlist(id: number): Promise<number[]> {
  if (!isAnimeId(id)) {
    throw new Error('Invalid anime ID.')
  }

  if (WATCHLIST_API_URL) {
    return requestWatchlist(`${WATCHLIST_API_URL}?anime_id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  }

  const updated = readLocalWatchlist().filter(item => item !== id)
  localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updated))
  return updated
}
