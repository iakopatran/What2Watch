export async function getWatchlist(): Promise<number[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const raw = localStorage.getItem("watchlist");

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed) || !parsed.every(item => typeof item === 'number')) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export async function addToWatchlist(id: number): Promise<number[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    if (typeof id !== "number" || Number.isNaN(id)) {
      throw new Error("Invalid anime ID");
    }

    const watchlist = await getWatchlist();

    if (watchlist.includes(id)) return watchlist;

    const updated = [...watchlist, id];

    localStorage.setItem("watchlist", JSON.stringify(updated));

    return updated;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`addToWatchlist failed: ${err.message}`);
    }
    throw new Error("addToWatchlist failed: unknown error");
  }
}

export async function removeFromWatchlist(id: number): Promise<number[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    if (typeof id !== "number" || Number.isNaN(id)) {
      throw new Error("Invalid anime ID");
    }

    const watchlist = await getWatchlist();

    if (!watchlist.includes(id)) return watchlist;

    const updated = watchlist.filter(item => item !== id);

    localStorage.setItem("watchlist", JSON.stringify(updated));

    return updated;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`removeFromWatchlist failed: ${err.message}`);
    }
    throw new Error("removeFromWatchlist failed: unknown error");
  }
}
