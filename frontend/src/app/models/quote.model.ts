export interface Quote {
  id: number;
  text: string;
  character_name: string;
  actor_name: string;
  movie_id: number;
  user_id: number;
  movie?: {
    id: number;
    title_fr: string;
    title_en: string;
    release_date: string;
    image_path: string | null;
  };
}
