import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../models/movie.model';
import { Quote } from '../models/quote.model';
import { ApiService } from './api.service';

interface QuotesResponse {
  quotes: Quote[];
}
interface QuoteResponse {
  quote: Quote;
}
interface SearchResponse {
  movies: Movie[];
  quotes: Quote[];
}

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Quote[]> {
    return this.api.get<QuotesResponse>('/quotes').pipe(map((r) => r.quotes));
  }

  getById(id: number): Observable<Quote> {
    return this.api.get<QuoteResponse>(`/quotes/${id}`).pipe(map((r) => r.quote));
  }

  getRandom(): Observable<Quote> {
    return this.api.get<QuoteResponse>('/quotes/random').pipe(map((r) => r.quote));
  }

  create(data: {
    text: string;
    character_name: string;
    actor_name: string;
    movie_id: number;
  }): Observable<Quote> {
    return this.api.post<QuoteResponse>('/quotes', data).pipe(map((r) => r.quote));
  }

  update(
    id: number,
    data: Partial<{ text: string; character_name: string; actor_name: string; movie_id: number }>,
  ): Observable<Quote> {
    return this.api.patch<QuoteResponse>(`/quotes/${id}`, data).pipe(map((r) => r.quote));
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/quotes/${id}`);
  }

  search(query: string): Observable<Quote[]> {
    return this.api
      .get<SearchResponse>(`/search?q=${encodeURIComponent(query)}`)
      .pipe(map((r) => r.quotes));
  }
}
