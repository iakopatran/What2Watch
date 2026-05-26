export type AnimeDetails = {
  id: number;
  title: {
    romaji: string;
  };
  description: string;
  averageScore: number;
  coverImage: {
    medium: string;
    large: string;
  };
};
