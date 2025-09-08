
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../../../services/auth.service';
import { AppointmentService } from '../../../services/appointment.service';

interface PatientHistory {
  patientId: number;
  patientName: string;
  lastAppointmentDate: string;
  lastAppointmentTime: string;
  symptoms: string;
  status: string;
  totalAppointments: number;
}

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PatientHistoryComponent implements OnInit {
  patientHistory: PatientHistory[] = [];
  userProfile: UserProfile | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const role = localStorage.getItem('role');
      
      if (!token || role !== 'DOCTOR') {
        this.router.navigate(['/login']);
        return;
      }
      
      this.loadUserProfile();
    }
  }

  private loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        if (profile.role !== 'DOCTOR' || !profile.doctorId) {
          this.errorMessage = 'User profile is not properly configured as a doctor';
          this.isLoading = false;
          return;
        }
        this.loadPatientHistory();
      },
      error: (error) => {
        this.errorMessage = `Failed to load user profile: ${error.message}`;
        this.isLoading = false;
        console.error('Error loading user profile:', error);
      }
    });
  }

  private loadPatientHistory(): void {
    if (!this.userProfile?.doctorId) return;
    
    this.appointmentService.getDoctorAppointments(this.userProfile.doctorId).subscribe({
      next: (appointments) => {
        // Process appointments to create patient history
        this.processPatientHistory(appointments);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Failed to load patient history: ${error.message}`;
        this.isLoading = false;
        console.error('Error loading patient history:', error);
      }
    });
  }

  private processPatientHistory(appointments: any[]): void {
    const patientMap = new Map<number, PatientHistory>();
    
    appointments.forEach(appointment => {
      const patientId = appointment.patientId;
      const patientName = appointment.patientName;
      
      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, {
          patientId: patientId,
          patientName: patientName,
          lastAppointmentDate: appointment.date,
          lastAppointmentTime: appointment.time,
          symptoms: appointment.symptoms,
          status: appointment.status,
          totalAppointments: 1
        });
      } else {
        const existing = patientMap.get(patientId)!;
        existing.totalAppointments++;
        
        // Update to most recent appointment
        if (new Date(appointment.date) > new Date(existing.lastAppointmentDate)) {
          existing.lastAppointmentDate = appointment.date;
          existing.lastAppointmentTime = appointment.time;
          existing.symptoms = appointment.symptoms;
          existing.status = appointment.status;
        }
      }
    });
    
    this.patientHistory = Array.from(patientMap.values())
      .sort((a, b) => new Date(b.lastAppointmentDate).getTime() - new Date(a.lastAppointmentDate).getTime());
  }

  goBack() {
    this.router.navigate(['/doctor/doctor-dashboard']);
  }
}
