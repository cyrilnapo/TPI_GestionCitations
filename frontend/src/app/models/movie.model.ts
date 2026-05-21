import { Quote } from './quote.model';

export interface Movie {
  id: number;
  title_fr: string;
  title_en: string;
  release_date: string;
  image_path: string | null;
  user_id: number;
  quotes?: Quote[];
}
