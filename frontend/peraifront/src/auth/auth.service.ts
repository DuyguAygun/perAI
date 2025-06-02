import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Word} from '../student/wordpuzzle/wordpuzzle.component';

interface LoginResponse {
  token: string;
  refreshToken: string;
  status: string;
  timestamp: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface User {
  name: string;
  lastName: string;
  id: bigint;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) {
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`http://localhost:8080/api/v1/users/me`);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.token) {
            localStorage.setItem('auth_token', response.token);
          }
        }),
        catchError(this.handleError)
      );
  }

  signup(userData: {
    name: string;
    lastName: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid email or password';
          break;
        case 429:
          errorMessage = 'Too many attempts. Please try again later';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later';
          break;
      }
    }

    return throwError(() => errorMessage);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private apiUrl = 'http://localhost:8080/api/v1/game/guess';

  constructor(private http: HttpClient) {
  }

  getWords(): Observable<Word[]> {
    return this.http.get<Word[]>(this.apiUrl);
  }
}
