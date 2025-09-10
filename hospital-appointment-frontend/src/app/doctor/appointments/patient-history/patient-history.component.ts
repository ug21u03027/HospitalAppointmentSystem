
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../../../services/auth.service';
import { AppointmentService, AppointmentDto, PatientDto } from '../../../services/appointment.service';

interface PatientHistory {
  patientId: number;
  patientName: string;
  lastAppointmentDate: string;
  lastAppointmentTime: string;
  symptoms: string;
  status: string;
  totalAppointments: number;
  approvedAppointments: number;
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
  selectedPatient: PatientDto | null = null;
  showPatientDetails = false;

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
    
    // Filter only approved appointments
    const approvedAppointments = appointments.filter(appointment => 
      appointment.status === 'APPROVED'
    );
    
    approvedAppointments.forEach(appointment => {
      const patientId = appointment.patientId;
      
      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, {
          patientId: patientId,
          patientName: 'Loading...', // Will be updated by loadPatientNames
          lastAppointmentDate: appointment.date,
          lastAppointmentTime: appointment.time,
          symptoms: appointment.symptoms,
          status: appointment.status,
          totalAppointments: 1,
          approvedAppointments: 1
        });
      } else {
        const existing = patientMap.get(patientId)!;
        existing.totalAppointments++;
        existing.approvedAppointments++;
        
        // Update to most recent approved appointment
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
    
    this.loadPatientNames();
  }

  private loadPatientNames(): void {
    this.patientHistory.forEach(patient => {
      this.appointmentService.getPatientById(patient.patientId).subscribe({
        next: (patientData) => {
          patient.patientName = patientData.name;
        },
        error: (error) => {
          console.error('Error loading patient name:', error);
          patient.patientName = 'Unknown Patient';
        }
      });
    });
  }

  viewPatientDetails(patientId: number) {
    this.appointmentService.getPatientById(patientId).subscribe({
      next: (patient) => {
        this.selectedPatient = patient;
        this.showPatientDetails = true;
      },
      error: (error) => {
        this.errorMessage = `Failed to load patient details: ${error.message}`;
        console.error('Error loading patient details:', error);
      }
    });
  }

  closePatientDetails() {
    this.showPatientDetails = false;
    this.selectedPatient = null;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'cancelled': return 'status-cancelled';
      case 'rejected': return 'status-rejected';
      case 'completed': return 'status-completed';
      default: return 'status-unknown';
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'fa-clock';
      case 'approved': return 'fa-check-circle';
      case 'cancelled': return 'fa-times-circle';
      case 'rejected': return 'fa-ban';
      case 'completed': return 'fa-check-double';
      default: return 'fa-question-circle';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(timeString: string): string {
    return timeString; // Time is already in HH:mm format
  }

  goBack() {
    this.router.navigate(['/doctor/doctor-dashboard']);
  }
}
