import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// DTOs matching backend
export interface AppointmentRequest {
  patientId: number;
  doctorId: number;
  symptoms: string;
  date: string; // ISO date string
  time: string; // HH:mm format
}

export interface UserProfile {
  userId: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'PATIENT' | 'DOCTOR';
  accountStatus: string;
  // Patient specific fields
  patientId?: number;
  name?: string;
  age?: number;
  phone?: string;
  // Doctor specific fields
  doctorId?: number;
  specialization?: string;
  availability?: string;
  consultationFee?: number;
}

export interface AppointmentDto {
  id: number;
  patientId: number;
  doctorId: number;
  symptoms: string;
  date: string; // ISO date string
  time: string; // HH:mm format
  status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'REJECTED' | 'COMPLETED';
}

export interface DoctorDto {
  doctorId: number;
  name: string;
  specialization: string;
  availability: string;
  phone: string;
  consultationFee: number;
  status: string;
}

export interface PatientDto {
  patientId: number;
  name: string;
  age: number;
  contact: string;
  userId: number;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface SlotRequest {
  doctorId: number;
  date: string; // ISO date string (YYYY-MM-DD)
}

export interface SlotResponse {
  doctorId: number;
  date: string;
  availableSlots: string[];
  bookedSlots: string[];
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Create a new appointment
   */
  createAppointment(request: AppointmentRequest): Observable<AppointmentDto> {
    const token = this.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    return this.http.post<AppointmentDto>(`${this.baseUrl}/appointments`, request, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Get user profile to get patient ID
   */
  getUserProfile(): Observable<UserProfile> {
    const token = this.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    return this.http.get<UserProfile>(`${this.baseUrl}/user/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Get all appointments for a specific patient
   */
  getPatientAppointments(patientId: number): Observable<AppointmentDto[]> {
    const token = this.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    return this.http.get<AppointmentDto[]>(`${this.baseUrl}/appointments/patient/${patientId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Get all available doctors
   */
  getDoctors(): Observable<DoctorDto[]> {
    const token = this.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    return this.http.get<DoctorDto[]>(`${this.baseUrl}/doctors`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Get doctors by specialization
   */
  getDoctorsBySpecialization(specialization: string): Observable<DoctorDto[]> {
    const token = this.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    return this.http.get<DoctorDto[]>(`${this.baseUrl}/doctors?specialization=${specialization}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Cancel an appointment
   */
  cancelAppointment(appointmentId: number): Observable<AppointmentDto> {
    const token = this.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    return this.http.put<AppointmentDto>(`${this.baseUrl}/appointments/${appointmentId}/cancel`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  /**
   * Handle HTTP errors and extract meaningful error messages
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error && typeof error.error === 'object') {
        const apiError = error.error as ApiErrorResponse;
        errorMessage = apiError.message || `Server Error: ${error.status} ${error.statusText}`;
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else {
        errorMessage = `Server Error: ${error.status} ${error.statusText}`;
      }
    }

    console.error('Appointment Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Get appointments for a specific doctor
   */
  getDoctorAppointments(doctorId: number): Observable<any[]> {
    const token = this.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    return this.http.get<any[]>(`${this.baseUrl}/appointments/doctor/${doctorId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Get patient by ID
   */
  getPatientById(patientId: number): Observable<PatientDto> {
    const token = this.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    return this.http.get<PatientDto>(`${this.baseUrl}/patients/${patientId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Approve appointment
   */
  approveAppointment(appointmentId: number): Observable<AppointmentDto> {
    const token = this.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    return this.http.put<AppointmentDto>(`${this.baseUrl}/appointments/${appointmentId}/approve`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Reject appointment
   */
  rejectAppointment(appointmentId: number): Observable<AppointmentDto> {
    const token = this.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    return this.http.put<AppointmentDto>(`${this.baseUrl}/appointments/${appointmentId}/reject`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Get available time slots for a doctor on a specific date
   */
  getAvailableSlots(request: SlotRequest): Observable<SlotResponse> {
    const token = this.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    return this.http.get<SlotResponse>(`${this.baseUrl}/appointments/slots`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        doctorId: request.doctorId.toString(),
        date: request.date
      }
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }
}
