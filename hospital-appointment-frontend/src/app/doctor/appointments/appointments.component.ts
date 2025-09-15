
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth.service';
import { AppointmentService, AppointmentDto, PatientDto } from '../../services/appointment.service';

interface DoctorAppointment extends AppointmentDto {
  patientName?: string;
}

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AppointmentsComponent implements OnInit {
  appointments: DoctorAppointment[] = [];
  userProfile: UserProfile | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  selectedPatient: PatientDto | null = null;
  showPatientDetails = false;
  selectedFilter = 'all';

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
        this.loadPatientNames();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Failed to load appointments: ${error.message}`;
        this.isLoading = false;
        console.error('Error loading appointments:', error);
      }
    });
  }

  private loadPatientNames(): void {
    this.appointments.forEach(appointment => {
      this.appointmentService.getPatientById(appointment.patientId).subscribe({
        next: (patient) => {
          appointment.patientName = patient.name;
        },
        error: (error) => {
          console.error('Error loading patient name:', error);
          appointment.patientName = 'Unknown Patient';
        }
      });
    });
  }

  approveAppointment(appointmentId: number) {
    this.isLoading = true;
    this.clearMessages();
    
    this.appointmentService.approveAppointment(appointmentId).subscribe({
      next: (response) => {
        const appt = this.appointments.find(a => a.id === appointmentId);
        if (appt) appt.status = 'APPROVED';
        this.successMessage = 'Appointment approved successfully.';
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Failed to approve appointment: ${error.message}`;
        this.isLoading = false;
        console.error('Error approving appointment:', error);
      }
    });
  }

  rejectAppointment(appointmentId: number) {
    this.isLoading = true;
    this.clearMessages();
    
    this.appointmentService.rejectAppointment(appointmentId).subscribe({
      next: (response) => {
        const appt = this.appointments.find(a => a.id === appointmentId);
        if (appt) appt.status = 'REJECTED';
        this.successMessage = 'Appointment rejected successfully.';
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Failed to reject appointment: ${error.message}`;
        this.isLoading = false;
        console.error('Error rejecting appointment:', error);
      }
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

  canApproveOrReject(appointment: DoctorAppointment): boolean {
    return appointment.status === 'PENDING';
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  filterAppointments(filter: string): void {
    this.selectedFilter = filter;
    // Filter logic is handled in the template using the filteredAppointments getter
  }

  get filteredAppointments(): DoctorAppointment[] {
    let filtered = this.appointments;
    
    if (this.selectedFilter !== 'all') {
      filtered = this.appointments.filter(appointment => {
        switch (this.selectedFilter) {
          case 'upcoming':
            const appointmentDate = new Date(appointment.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return appointmentDate >= today && (appointment.status === 'PENDING' || appointment.status === 'APPROVED');
          case 'approved':
            return appointment.status === 'APPROVED';
          case 'cancelled':
            return appointment.status === 'CANCELLED';
          case 'rejected':
            return appointment.status === 'REJECTED';
          case 'completed':
            return appointment.status === 'COMPLETED';
          default:
            return true;
        }
      });
    }
    
    // Sort by date and time with earliest on top
    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  }

  goBack() {
    this.router.navigate(['/doctor-dashboard']);
  }
}
