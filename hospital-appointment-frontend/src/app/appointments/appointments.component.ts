import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppointmentService, AppointmentDto, DoctorDto, UserProfile } from '../services/appointment.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: AppointmentDto[] = [];
  doctors: DoctorDto[] = [];
  userProfile: UserProfile | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  selectedFilter = 'all';

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const role = localStorage.getItem('role');
      
      if (!token || role !== 'PATIENT') {
        this.router.navigate(['/login']);
        return;
      }
      
      // Load user profile to get patient ID
      this.loadUserProfile();
    }
  }

  private loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.appointmentService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        if (profile.role !== 'PATIENT' || !profile.patientId) {
          this.errorMessage = 'User profile is not properly configured as a patient';
          this.isLoading = false;
          return;
        }
        this.loadDoctors();
        this.loadAppointments();
      },
      error: (error) => {
        this.errorMessage = `Failed to load user profile: ${error.message}`;
        this.isLoading = false;
        console.error('Error loading user profile:', error);
      }
    });
  }

  private loadDoctors(): void {
    this.appointmentService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        // Don't show error for doctors as it's not critical for appointments display
      }
    });
  }

  private loadAppointments(): void {
    if (!this.userProfile?.patientId) {
      this.errorMessage = 'No patient ID available';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.appointmentService.getPatientAppointments(this.userProfile.patientId).subscribe({
      next: (appointments) => {
        this.appointments = appointments.sort((a, b) => {
          // Sort by date (newest first), then by time
          const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
          if (dateCompare !== 0) return dateCompare;
          return b.time.localeCompare(a.time);
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Failed to load appointments: ${error.message}`;
        this.isLoading = false;
        console.error('Error loading appointments:', error);
      }
    });
  }

  getDoctorName(doctorId: number): string {
    const doctor = this.doctors.find(d => d.doctorId === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  }

  getDoctorSpecialization(doctorId: number): string {
    const doctor = this.doctors.find(d => d.doctorId === doctorId);
    return doctor ? doctor.specialization : 'General';
  }

  getDoctorFee(doctorId: number): number {
    const doctor = this.doctors.find(d => d.doctorId === doctorId);
    return doctor ? doctor.consultationFee : 0;
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

  cancelAppointment(appointment: AppointmentDto): void {
    if (!confirm(`Are you sure you want to cancel your appointment with ${this.getDoctorName(appointment.doctorId)} on ${appointment.date} at ${appointment.time}?`)) {
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    this.appointmentService.cancelAppointment(appointment.id).subscribe({
      next: (cancelledAppointment) => {
        this.successMessage = 'Appointment cancelled successfully.';
        this.isLoading = false;
        // Reload appointments to reflect the change
        this.loadAppointments();
      },
      error: (error) => {
        this.errorMessage = `Failed to cancel appointment: ${error.message}`;
        this.isLoading = false;
        console.error('Error cancelling appointment:', error);
      }
    });
  }

  rescheduleAppointment(appointment: AppointmentDto): void {
    // Show confirmation dialog
    const confirmed = confirm(
      'Are you sure you want to reschedule this appointment?\n\n' +
      'The current appointment will be cancelled and you will be redirected to book a new appointment with the same doctor.'
    );
    
    if (confirmed) {
      // Cancel the current appointment first
      this.appointmentService.cancelAppointment(appointment.id).subscribe({
        next: (cancelledAppointment) => {
          console.log('Appointment cancelled for rescheduling:', cancelledAppointment);
          
          // Get doctor specialization for pre-selection
          const doctorSpecialization = this.getDoctorSpecialization(appointment.doctorId);
          
          // Navigate to book appointment with pre-filled data
          this.router.navigate(['/book-appointment'], {
            queryParams: {
              doctorId: appointment.doctorId,
              specialization: doctorSpecialization,
              symptoms: appointment.symptoms
            }
          });
        },
        error: (error) => {
          console.error('Error cancelling appointment for reschedule:', error);
          this.errorMessage = 'Failed to cancel appointment. Please try again.';
        }
      });
    }
  }

  bookNewAppointment(): void {
    this.router.navigate(['/book-appointment']);
  }

  filterAppointments(filter: string): void {
    this.selectedFilter = filter;
    // Filter logic is handled in the template using the filteredAppointments getter
  }

  get filteredAppointments(): AppointmentDto[] {
    if (this.selectedFilter === 'all') {
      return this.appointments;
    }
    
    return this.appointments.filter(appointment => {
      switch (this.selectedFilter) {
        case 'upcoming':
          const appointmentDate = new Date(appointment.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return appointmentDate >= today && appointment.status === 'PENDING';
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

  canCancelAppointment(appointment: AppointmentDto): boolean {
    return appointment.status === 'PENDING' || appointment.status === 'APPROVED';
  }

  canRescheduleAppointment(appointment: AppointmentDto): boolean {
    return appointment.status === 'APPROVED';
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

  goBack(): void {
    this.router.navigate(['/patient-dashboard']);
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}