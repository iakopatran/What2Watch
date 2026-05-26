export const moods = ['hype', 'chill', 'dark', 'emotional'] as const
export type Mood = (typeof moods)[number]
