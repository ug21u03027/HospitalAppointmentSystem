
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth.service';
import { AppointmentService } from '../../services/appointment.service';

interface Appointment {
  appointmentId: number;
  patientName: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  symptoms: string;
}

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
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
        this.loadAppointments();
      },
      error: (error) => {
        this.errorMessage = `Failed to load user profile: ${error.message}`;
        this.isLoading = false;
        console.error('Error loading user profile:', error);
      }
    });
  }

  private loadAppointments(): void {
    if (!this.userProfile?.doctorId) return;
    
    this.appointmentService.getDoctorAppointments(this.userProfile.doctorId).subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Failed to load appointments: ${error.message}`;
        this.isLoading = false;
        console.error('Error loading appointments:', error);
      }
    });
  }

  markCompleted(appointmentId: number) {
    this.appointmentService.updateAppointmentStatus(appointmentId, 'COMPLETED').subscribe({
      next: (response) => {
        const appt = this.appointments.find(a => a.appointmentId === appointmentId);
        if (appt) appt.status = 'COMPLETED';
      },
      error: (error) => {
        this.errorMessage = `Failed to update appointment: ${error.message}`;
        console.error('Error updating appointment:', error);
      }
    });
  }

  markCancelled(appointmentId: number) {
    this.appointmentService.updateAppointmentStatus(appointmentId, 'CANCELLED').subscribe({
      next: (response) => {
        const appt = this.appointments.find(a => a.appointmentId === appointmentId);
        if (appt) appt.status = 'CANCELLED';
      },
      error: (error) => {
        this.errorMessage = `Failed to update appointment: ${error.message}`;
        console.error('Error updating appointment:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/doctor/doctor-dashboard']);
  }
}
