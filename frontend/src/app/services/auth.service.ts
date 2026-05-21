import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { API_BASE_URL } from './api.config';

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

interface AuthResponse {
  message: string;
  user?: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiBaseUrl = API_BASE_URL;
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(null);
  private csrfToken: string | null = null;

  readonly user$ = this.userSubject.asObservable();
  readonly isAuthenticated$ = this.user$.pipe(map((user) => !!user));
  readonly isAdmin$ = this.user$.pipe(map((user) => user?.role === 'admin'));

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<AuthUser> {
    return this.postWithCsrf<AuthResponse>(`${this.apiBaseUrl}/login`, { username, password }).pipe(
      map((response) => response.user as AuthUser),
      tap((user) => this.setUser(user)),
    );
  }

  register(username: string, password: string): Observable<AuthUser> {
    return this.postWithCsrf<AuthResponse>(`${this.apiBaseUrl}/register`, {
      username,
      password,
    }).pipe(
      map((response) => response.user as AuthUser),
      tap((user) => this.setUser(user)),
    );
  }

  logout(): Observable<void> {
    return this.postWithCsrf<AuthResponse>(`${this.apiBaseUrl}/logout`, {}).pipe(
      tap(() => this.setUser(null)),
      map(() => undefined),
    );
  }

  refreshProfile(): Observable<AuthUser | null> {
    return this.http
      .get<AuthResponse>(`${this.apiBaseUrl}/profile`, { withCredentials: true })
      .pipe(
        map((response) => response.user ?? null),
        tap((user) => this.setUser(user)),
        catchError(() => {
          this.setUser(null);
          return of(null);
        }),
      );
  }

  private ensureCsrfToken(): Observable<void> {
    if (this.csrfToken) {
      return of(undefined);
    }

    return this.http
      .get<{ csrf_token: string }>(`${this.apiBaseUrl}/csrf-token`, { withCredentials: true })
      .pipe(
        tap((response) => {
          this.csrfToken = response.csrf_token;
        }),
        map(() => undefined),
      );
  }

  private postWithCsrf<T>(url: string, payload: Record<string, unknown>): Observable<T> {
    return this.ensureCsrfToken().pipe(
      switchMap(() =>
        this.http.post<T>(url, payload, {
          withCredentials: true,
          headers: new HttpHeaders({
            'X-CSRF-TOKEN': this.csrfToken ?? '',
          }),
        }),
      ),
    );
  }

  private setUser(user: AuthUser | null): void {
    this.userSubject.next(user);
  }
}
