import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest { username: string; password: string; }
export interface AuthResponse {
  accessToken: string | null;
  tokenType: string | null;
  userId: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'PATIENT' | 'DOCTOR' | 'USER';
  status?: string;
  message?: string;
}
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'PATIENT' | 'DOCTOR' | 'USER';
  name?: string;
  age?: number;
  contact?: string;
  specialization?: string;
  availability?: string;
  phone?: string;
  consultationFee?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((res) => {
        if (!res?.accessToken) return;
        if (typeof window === 'undefined') return;
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('tokenType', res.tokenType || 'Bearer');
        localStorage.setItem('role', res.role);
        localStorage.setItem('username', res.username);
        localStorage.setItem('email', res.email || '');
        localStorage.setItem('userId', String(res.userId));
      })
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload);
  }

  getRole(): AuthResponse['role'] | null {
    if (typeof window === 'undefined') return null;
    return (localStorage.getItem('role') as any) || null;
  }

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
  }
}
