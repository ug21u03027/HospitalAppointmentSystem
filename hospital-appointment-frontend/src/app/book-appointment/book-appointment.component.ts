import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AppointmentService, AppointmentRequest, DoctorDto, UserProfile, SlotRequest, SlotResponse } from '../services/appointment.service';
import { SpecializationService, SpecializationOption } from '../services/specialization.service';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  doctors: DoctorDto[] = [];
  filteredDoctors: DoctorDto[] = [];
  specializations: SpecializationOption[] = [];
  selectedSpecialization: string = '';
  userProfile: UserProfile | null = null;
  today: string = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  availableTimes: string[] = [];
  isLoadingSlots = false;
  
  // Pending values from query parameters
  pendingDoctorId: number | null = null;
  pendingSymptoms: string = '';

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private specializationService: SpecializationService
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
    this.specializations = this.specializationService.getSpecializations();
    
    // Handle query parameters for rescheduling
    this.route.queryParams.subscribe(params => {
      // Store query parameters for later use
      this.pendingDoctorId = params['doctorId'] ? +params['doctorId'] : null;
      this.pendingSymptoms = params['reason'] || params['symptoms'] || '';
      
      // Handle specialization pre-selection
      if (params['specialization']) {
        this.selectedSpecialization = params['specialization'];
        // Load doctors for the selected specialization
        this.loadDoctorsBySpecialization(params['specialization']);
      } else if (this.pendingDoctorId) {
        // If no specialization but doctorId is provided, load all doctors
        this.loadAllDoctors();
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
        // Don't load doctors initially - wait for specialization selection
      },
      error: (error) => {
        this.errorMessage = `Failed to load user profile: ${error.message}`;
        this.isLoading = false;
        console.error('Error loading user profile:', error);
      }
    });
  }

  private loadAllDoctors(): void {
    console.log('loadAllDoctors called');
    this.isLoading = true;
    this.errorMessage = '';
    
    this.appointmentService.getDoctors().subscribe({
      next: (doctors) => {
        console.log('All doctors loaded successfully:', doctors);
        this.doctors = doctors;
        this.filteredDoctors = doctors;
        this.isLoading = false;
        
        // Apply pending values after doctors are loaded
        this.applyPendingValues();
      },
      error: (error) => {
        console.error('Error loading all doctors:', error);
        this.errorMessage = `Failed to load doctors: ${error.message}`;
        this.isLoading = false;
      }
    });
  }

  private loadDoctorsBySpecialization(specialization: string): void {
    console.log('loadDoctorsBySpecialization called with:', specialization);
    this.isLoading = true;
    this.errorMessage = '';
    
    this.appointmentService.getDoctorsBySpecialization(specialization).subscribe({
      next: (doctors) => {
        console.log('Doctors loaded successfully:', doctors);
        this.doctors = doctors;
        this.filteredDoctors = doctors;
        this.isLoading = false;
        
        // Apply pending values after doctors are loaded
        this.applyPendingValues();
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.errorMessage = `Failed to load doctors: ${error.message}`;
        this.isLoading = false;
      }
    });
  }

  private applyPendingValues(): void {
    if (this.pendingDoctorId) {
      // Check if the pending doctor exists in the loaded doctors
      const doctorExists = this.doctors.some(d => d.doctorId === this.pendingDoctorId);
      if (doctorExists) {
        this.appointmentForm.patchValue({
          doctorId: this.pendingDoctorId,
          symptoms: this.pendingSymptoms
        });
        console.log('Applied pending values:', {
          doctorId: this.pendingDoctorId,
          symptoms: this.pendingSymptoms
        });
      } else {
        console.warn('Pending doctor not found in loaded doctors:', this.pendingDoctorId);
      }
      
      // Clear pending values
      this.pendingDoctorId = null;
      this.pendingSymptoms = '';
    }
  }

  selectDoctor(doctorId: number): void {
    this.appointmentForm.patchValue({ doctorId: doctorId });
    this.clearMessages();
    // Clear time selection when doctor changes
    this.appointmentForm.patchValue({ time: '' });
    this.availableTimes = [];
    
    // Load available slots if date is already selected
    const date = this.appointmentForm.get('date')?.value;
    if (date) {
      this.loadAvailableSlots(doctorId, date);
    }
  }

  onSpecializationChange(newValue: string): void {
    console.log('onSpecializationChange called with:', newValue);
    
    // Update the selectedSpecialization property
    this.selectedSpecialization = newValue;
    
    // Clear selected doctor when specialization changes
    this.appointmentForm.patchValue({ doctorId: '' });
    
    if (this.selectedSpecialization === '') {
      // Load all doctors when "All Specializations" is selected
      this.loadAllDoctors();
    } else {
      // Load doctors for the selected specialization
      console.log('Loading doctors for specialization:', this.selectedSpecialization);
      this.loadDoctorsBySpecialization(this.selectedSpecialization);
    }
  }

  onDateChange(): void {
    const doctorId = this.appointmentForm.get('doctorId')?.value;
    const date = this.appointmentForm.get('date')?.value;
    
    // Clear time selection when date changes
    this.appointmentForm.patchValue({ time: '' });
    this.availableTimes = [];
    
    // Load available slots if both doctor and date are selected
    if (doctorId && date) {
      this.loadAvailableSlots(doctorId, date);
    }
  }

  onDoctorChange(): void {
    const doctorId = this.appointmentForm.get('doctorId')?.value;
    const date = this.appointmentForm.get('date')?.value;
    
    // Clear time selection when doctor changes
    this.appointmentForm.patchValue({ time: '' });
    this.availableTimes = [];
    
    // Load available slots if both doctor and date are selected
    if (doctorId && date) {
      this.loadAvailableSlots(doctorId, date);
    }
  }

  private loadAvailableSlots(doctorId: number, date: string): void {
    this.isLoadingSlots = true;
    this.errorMessage = '';
    
    const slotRequest: SlotRequest = {
      doctorId: doctorId,
      date: date
    };
    
    this.appointmentService.getAvailableSlots(slotRequest).subscribe({
      next: (response: SlotResponse) => {
        this.availableTimes = response.availableSlots;
        this.isLoadingSlots = false;
        console.log('Available slots loaded:', response);
      },
      error: (error) => {
        console.error('Error loading available slots:', error);
        this.errorMessage = `Failed to load available time slots: ${error.message}`;
        this.isLoadingSlots = false;
        this.availableTimes = [];
      }
    });
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
    return doctor ? this.specializationService.getSpecializationLabel(doctor.specialization) : 'General';
  }

  // Helper method to get doctor fee by ID
  getDoctorFee(doctorId: number): number {
    const doctor = this.doctors.find(d => d.doctorId === doctorId);
    return doctor ? doctor.consultationFee : 0;
  }
}