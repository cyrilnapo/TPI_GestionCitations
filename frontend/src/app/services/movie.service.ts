import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../models/movie.model';
import { Quote } from '../models/quote.model';
import { ApiService } from './api.service';

interface MoviesResponse {
  movies: Movie[];
}
interface MovieResponse {
  movie: Movie;
}
interface SearchResponse {
  movies: Movie[];
  quotes: Quote[];
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Movie[]> {
    return this.api.get<MoviesResponse>('/movies').pipe(map((r) => r.movies));
  }

  getById(id: number): Observable<Movie> {
    return this.api.get<MovieResponse>(`/movies/${id}`).pipe(map((r) => r.movie));
  }

  create(data: {
    title_fr: string;
    title_en: string;
    release_date: string;
    image_path?: string;
  }): Observable<Movie> {
    return this.api.post<MovieResponse>('/movies', data).pipe(map((r) => r.movie));
  }

  update(
    id: number,
    data: Partial<{ title_fr: string; title_en: string; release_date: string; image_path: string }>,
  ): Observable<Movie> {
    return this.api.patch<MovieResponse>(`/movies/${id}`, data).pipe(map((r) => r.movie));
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/movies/${id}`);
  }

  search(query: string): Observable<Movie[]> {
    return this.api
      .get<SearchResponse>(`/search?q=${encodeURIComponent(query)}`)
      .pipe(map((r) => r.movies));
  }
}
