import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface UserProfile {
  userId: number;
  name: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'PATIENT' | 'DOCTOR';
  accountStatus: 'ACTIVATED' | 'DEACTIVATED' | 'PENDING' | 'BLOCKED';
  createdAt: string;
  patientId?: number;
  doctorId?: number;
  age?: number;
  phone?: string;
  // Doctor specific fields
  specialization?: string;
  availability?: string;
  consultationFee?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private handleError(error: any): Observable<never> {
    console.error('User service error:', error);
    let errorMessage = 'An error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  getAllUsers(): Observable<UserProfile[]> {
    const token = this.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    
    return this.http.get<UserProfile[]>(`${this.baseUrl}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).pipe(catchError(this.handleError.bind(this)));
  }

  blockUser(userId: number): Observable<UserProfile> {
    const token = this.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    
    return this.http.put<UserProfile>(`${this.baseUrl}/${userId}/block`, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).pipe(catchError(this.handleError.bind(this)));
  }

  activateUser(userId: number): Observable<UserProfile> {
    const token = this.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    
    return this.http.put<UserProfile>(`${this.baseUrl}/${userId}/activate`, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).pipe(catchError(this.handleError.bind(this)));
  }

  getDoctorById(doctorId: number): Observable<UserProfile> {
    const token = this.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    
    return this.http.get<UserProfile>(`${this.baseUrl}/doctors/${doctorId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).pipe(catchError(this.handleError.bind(this)));
  }
}
