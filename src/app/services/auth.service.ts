import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(null);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    // Optional: verify token with API
    this.http.get(`${this.apiUrl}/user`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(() => true),
      catchError(() => of(false))
    ).subscribe(isValid => {
      if (!isValid) {
        this.logout();
      }
    });

    return !!token;
  }
}
