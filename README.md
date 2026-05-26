# What2Watch

What2Watch is an anime discovery app built with Next.js, React, TypeScript,
TanStack Query, Tailwind CSS, and the AniList GraphQL API.

## MVP

- Questionnaire-driven Discover page with mood, time, discovery style, genre,
  and content-avoidance preferences.
- Deterministic recommendation scoring with visible match reasons.
- Ranked AniList results with save-to-watchlist actions.
- Watchlist grid and detail view backed by browser storage for the current
  frontend milestone.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Validation:

```bash
npm run lint
npm run build
```

## Recommendation Flow

```txt
RecommendationPreferences
-> buildQueryVariables()
-> fetchCandidateAnime() through /api/anilist
-> scoreAnime()
-> rankAnime()
-> RecommendationResults
```

Candidate retrieval stays broad. The local scoring layer ranks candidates using
mood matches, watch-time fit, discovery style, preferred genres, avoided
genres/tags, and community score.

## PHP, MySQL, And AWS Plan

The next integration milestone replaces browser watchlist storage with one-user
server persistence:

```txt
Next.js frontend
-> PHP JSON endpoint hosted on AWS Lightsail LAMP
-> MariaDB/MySQL watchlist table
```

Initial schema:

```sql
CREATE TABLE watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL DEFAULT 1,
  anime_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_saved_anime (user_id, anime_id)
);
```

Initial PHP API contract:

```txt
GET    /api/watchlist.php             Return saved AniList IDs for user 1
POST   /api/watchlist.php             Insert an AniList ID
DELETE /api/watchlist.php?anime_id=1  Remove an AniList ID
```

The frontend hook boundary is already suitable for this migration:
`getWatchlist`, `addToWatchlist`, and `removeFromWatchlist` in
`src/app/watchlist/lib/storage.ts` can be changed from `localStorage` calls to
HTTP requests without rewriting the Discover or Watchlist components.
