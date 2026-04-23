


export async function getWatchlist(): Promise<number[]> {
  // simulate network delay (represents server latency)
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const raw = localStorage.getItem("watchlist");

    // no data yet → valid empty state
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    // ensure correct shape (array of numbers)
    if (!Array.isArray(parsed) || !parsed.every(item => typeof item === 'number')) {
      // corrupted or unexpected data → reset to safe default
      return [];
    }

    return parsed;
  } catch (err) {
    // JSON.parse or storage failure
    // NOTE: we intentionally DO NOT throw here
    // because this is a READ function and should be resilient
    return [];
  }
}

export async function addToWatchlist(id: number): Promise<number[]> {
  // simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    // validate input early (defensive programming)
    if (typeof id !== "number" || Number.isNaN(id)) {
      throw new Error("Invalid anime ID");
    }

    const watchlist = await getWatchlist();

    // idempotency: do nothing if already exists
    if (watchlist.includes(id)) return watchlist;

    // immutable update (future-proof for shared state systems)
    const updated = [...watchlist, id];

    // persist to source of truth
    localStorage.setItem("watchlist", JSON.stringify(updated));

    return updated;
  } catch (err) {
    // preserve original error context if possible
    if (err instanceof Error) {
      throw new Error(`addToWatchlist failed: ${err.message}`);
    }

    // fallback (unknown error type)
    throw new Error("addToWatchlist failed: unknown error");
  }
}

export async function removeFromWatchlist(id: number): Promise<number[]> {
  // simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    // validate input early (defensive programming)
    if (typeof id !== "number" || Number.isNaN(id)) {
      throw new Error("Invalid anime ID");
    }

    const watchlist = await getWatchlist();

    // idempotency: removing something that isn't there does nothing
    if (!watchlist.includes(id)) return watchlist;

    // immutable removal (no mutation of original array)
    const updated = watchlist.filter(item => item !== id);

    // persist updated state
    localStorage.setItem("watchlist", JSON.stringify(updated));

    return updated;

  } catch (err) {
    // preserve original error context
    if (err instanceof Error) {
      throw new Error(`removeFromWatchlist failed: ${err.message}`);
    }

    // fallback for non-Error throws (rare but safe)
    throw new Error("removeFromWatchlist failed: unknown error");
  }
}