import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, switchMap, tap, map } from 'rxjs';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private csrfToken: string | null = null;

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${API_BASE_URL}${path}`, { withCredentials: true });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.withCsrf(() =>
      this.http.post<T>(`${API_BASE_URL}${path}`, body, {
        withCredentials: true,
        headers: this.csrfHeaders(),
      }),
    );
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.withCsrf(() =>
      this.http.patch<T>(`${API_BASE_URL}${path}`, body, {
        withCredentials: true,
        headers: this.csrfHeaders(),
      }),
    );
  }

  delete<T>(path: string): Observable<T> {
    return this.withCsrf(() =>
      this.http.delete<T>(`${API_BASE_URL}${path}`, {
        withCredentials: true,
        headers: this.csrfHeaders(),
      }),
    );
  }

  private withCsrf<T>(request: () => Observable<T>): Observable<T> {
    return this.ensureCsrf().pipe(switchMap(request));
  }

  private ensureCsrf(): Observable<void> {
    if (this.csrfToken) return of(undefined);
    return this.http
      .get<{ csrf_token: string }>(`${API_BASE_URL}/csrf-token`, { withCredentials: true })
      .pipe(
        tap((r) => (this.csrfToken = r.csrf_token)),
        map(() => undefined),
      );
  }

  private csrfHeaders(): HttpHeaders {
    return new HttpHeaders({ 'X-CSRF-TOKEN': this.csrfToken ?? '' });
  }
}
