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

export interface UserProfile {
  userId: number;
  name: string;
  username: string;
  email: string;
  role: string;
  accountStatus: string;
  // Role specific fields
  patientId?: number;
  doctorId?: number;
  age?: number;
  specialization?: string;
  availability?: string;
  phone?: string;
  consultationFee?: number;
}

export interface PatientUpdateRequest {
  name: string;
  age: number;
  contact: string;
}

export interface DoctorUpdateRequest {
  name: string;
  specialization: string;
  availability: string;
  phone: string;
  consultationFee: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api/auth';
  private readonly userUrl = 'http://localhost:8080/api/user';
  private readonly patientUrl = 'http://localhost:8080/api/patients';
  private readonly doctorUrl = 'http://localhost:8080/api/doctors';

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

  getProfile(): Observable<UserProfile> {
    const token = localStorage.getItem('accessToken');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<UserProfile>(`${this.userUrl}/me`, { headers });
  }

  updatePatient(patientId: number, updateData: PatientUpdateRequest): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${this.patientUrl}/${patientId}`, updateData, { headers });
  }

  updateDoctor(doctorId: number, updateData: DoctorUpdateRequest): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = { 'Authorization': `Bearer ${token}` };
    const currentUserId = localStorage.getItem('userId');
    const currentUserRole = localStorage.getItem('role');
    return this.http.put(`${this.doctorUrl}/${doctorId}?currentUserId=${currentUserId}&currentUserRole=${currentUserRole}`, updateData, { headers });
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
