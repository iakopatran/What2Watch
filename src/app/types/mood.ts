export const moods = ["hype", "chill", "dark"] as const;
export type Mood = (typeof moods)[number];