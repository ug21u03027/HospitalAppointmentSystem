import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AppointmentService, AppointmentRequest, DoctorDto, UserProfile } from '../services/appointment.service';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  doctors: DoctorDto[] = [];
  userProfile: UserProfile | null = null;
  today: string = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.appointmentForm = this.fb.group({
      doctorId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      symptoms: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.checkAuthStatus();
    this.today = new Date().toISOString().split('T')[0];
    
    // Handle query parameters for rescheduling
    this.route.queryParams.subscribe(params => {
      if (params['doctorId']) {
        this.appointmentForm.patchValue({
          doctorId: +params['doctorId'],
          date: params['date'] || '',
          time: params['time'] || '',
          symptoms: params['reason'] || params['symptoms'] || ''
        });
      }
    });
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
        this.isLoading = false;
        this.loadDoctors();
      },
      error: (error) => {
        this.errorMessage = `Failed to load user profile: ${error.message}`;
        this.isLoading = false;
        console.error('Error loading user profile:', error);
      }
    });
  }

  private loadDoctors(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.appointmentService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Failed to load doctors: ${error.message}`;
        this.isLoading = false;
        console.error('Error loading doctors:', error);
      }
    });
  }

  selectDoctor(doctorId: number): void {
    this.appointmentForm.patchValue({ doctorId: doctorId });
    this.clearMessages();
  }

  onBook(): void {
    if (this.appointmentForm.invalid || !this.userProfile?.patientId) {
      this.errorMessage = 'Please fill in all required fields and ensure you have a valid patient profile';
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    const appointmentRequest: AppointmentRequest = {
      patientId: this.userProfile.patientId,
      doctorId: +this.appointmentForm.value.doctorId,
      symptoms: this.appointmentForm.value.symptoms,
      date: this.appointmentForm.value.date,
      time: this.appointmentForm.value.time
    };

    this.appointmentService.createAppointment(appointmentRequest).subscribe({
      next: (createdAppointment) => {
        this.successMessage = 'Appointment booked successfully! You will receive a confirmation shortly.';
        this.isLoading = false;
        
        // Reset form
        this.appointmentForm.reset();
        
        // Navigate to appointments after a short delay
        setTimeout(() => {
          this.router.navigate(['/appointments']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = `Failed to book appointment: ${error.message}`;
        this.isLoading = false;
        console.error('Error booking appointment:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/patient-dashboard']);
  }

  cancel(): void {
    this.router.navigate(['/patient-dashboard']);
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Helper method to get doctor name by ID
  getDoctorName(doctorId: number): string {
    const doctor = this.doctors.find(d => d.doctorId === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  }

  // Helper method to get doctor specialization by ID
  getDoctorSpecialization(doctorId: number): string {
    const doctor = this.doctors.find(d => d.doctorId === doctorId);
    return doctor ? doctor.specialization : 'General';
  }

  // Helper method to get doctor fee by ID
  getDoctorFee(doctorId: number): number {
    const doctor = this.doctors.find(d => d.doctorId === doctorId);
    return doctor ? doctor.consultationFee : 0;
  }
}