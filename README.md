# What2Watch

What2Watch is an anime discovery app built with Next.js, React, TypeScript,
TanStack Query, Tailwind CSS, and the AniList GraphQL API.

## MVP

- Questionnaire-driven Discover page with mood, time, discovery style, genre,
  and content-avoidance preferences.
- Deterministic recommendation scoring with visible match reasons.
- Ranked AniList results with save-to-watchlist actions.
- Watchlist grid and detail view backed by PHP and MySQL in the AWS
  deployment, with browser storage available for unconfigured local work.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Without a configured PHP endpoint, local development stores watchlist IDs in
browser `localStorage`. To use an available PHP endpoint, build or run with:

```bash
NEXT_PUBLIC_WATCHLIST_API_URL=/php-api/watchlist.php npm run build
```

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

## PHP, MySQL, And AWS Deployment

The submission architecture uses one-user server persistence:

```txt
Browser
-> Apache on Amazon EC2
   -> Next.js server on localhost:3000 for UI and /api/anilist
   -> PHP JSON endpoint at /php-api/watchlist.php
-> Amazon RDS for MySQL, private access from EC2 only
```

The RDS database is MySQL `8.4`, configured with public access disabled and a
security group rule permitting port `3306` only from the EC2 application
security group. PHP connects over TLS using the restricted `what2watch_app`
database user.

Schema:

```sql
CREATE TABLE watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL DEFAULT 1,
  anime_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_saved_anime (user_id, anime_id)
);
```

PHP API contract:

```txt
GET    /php-api/watchlist.php             Return saved AniList IDs for user 1
POST   /php-api/watchlist.php             Insert an AniList ID
DELETE /php-api/watchlist.php?anime_id=1  Remove an AniList ID
```

The frontend persistence boundary is implemented in
`src/app/watchlist/lib/storage.ts`: setting `NEXT_PUBLIC_WATCHLIST_API_URL`
switches the existing Discover and Watchlist components to the PHP API without
component changes.

The deployable PHP endpoint, SQL schema, protected configuration template, and
Apache proxy setup are documented in `backend/README.md`. A production
`systemd` unit for the Next.js server is included in
`deploy/systemd/what2watch.service`.

For a detailed class presentation walkthrough of the AWS services, security
configuration, EC2 software, PHP/MySQL implementation, and protected
credentials/files, see `docs/DEPLOYMENT_WRITEUP.md`.
