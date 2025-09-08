import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HospitalService, Patient, Doctor } from '../services/hospital';
import { AuthService, UserProfile, PatientUpdateRequest, DoctorUpdateRequest } from '../services/auth.service';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: UserProfile | null = null;
  userRole: string = '';
  isEditing: boolean = false;
  userName: string = '';
  isLoading: boolean = false;
  isUpdating: boolean = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private router: Router,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: [''],
      username: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: [''],
      age: [null, [Validators.min(1)]],
      specialization: [''],
      availability: [''],
      consultationFee: [null]
    });
  }

  ngOnInit(): void {
    this.checkAuthStatus();
    this.fetchProfileData();
  }

  private setupFormValidation(): void {
    // Set required validators based on user role
    if (this.userRole === 'PATIENT') {
      this.profileForm.get('name')?.setValidators([Validators.required]);
      this.profileForm.get('phone')?.setValidators([Validators.required]);
    } else if (this.userRole === 'DOCTOR') {
      this.profileForm.get('name')?.setValidators([Validators.required]);
      this.profileForm.get('phone')?.setValidators([Validators.required]);
      this.profileForm.get('specialization')?.setValidators([Validators.required]);
    }
    // Admin users don't have required fields for name and phone
    
    // Update validation status
    this.profileForm.updateValueAndValidity();
  }

  private checkAuthStatus(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const role = localStorage.getItem('role');
      const username = localStorage.getItem('username');
      
      if (!token) {
        this.router.navigate(['/login']);
        return;
      }
      
      this.userRole = role || '';
      this.userName = username || '';
      this.setupFormValidation();
    }
  }

  fetchProfileData(): void {
    this.isLoading = true;
    this.error = '';
    
    this.authService.getProfile().subscribe({
      next: (profile: UserProfile) => {
        this.currentUser = profile;
        this.userRole = profile.role;
        this.userName = profile.name;
        this.loadProfileData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
        this.error = 'Failed to load profile data. Please try again.';
        this.isLoading = false;
        // Fallback to localStorage data if API fails
        this.loadFallbackData();
      }
    });
  }

  private loadFallbackData(): void {
    // Fallback to localStorage data if API call fails
    if (typeof window !== 'undefined') {
      this.currentUser = {
        userId: parseInt(localStorage.getItem('userId') || '0'),
        name: localStorage.getItem('username') || 'User',
        username: localStorage.getItem('username') || '',
        email: localStorage.getItem('email') || '',
        role: localStorage.getItem('role') || '',
        accountStatus: 'ACTIVE',
        phone: '',
        // Role specific fields
        ...(this.userRole === 'PATIENT' && {
          patientId: parseInt(localStorage.getItem('userId') || '0'),
          age: 0
        }),
        ...(this.userRole === 'DOCTOR' && {
          doctorId: parseInt(localStorage.getItem('userId') || '0'),
          specialization: '',
          availability: '',
          consultationFee: 0
        })
      };
      this.loadProfileData();
    }
  }

  loadProfileData(): void {
    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name,
        username: this.currentUser.username,
        email: this.currentUser.email,
        phone: this.currentUser.phone,
        age: this.currentUser.age,
        specialization: this.currentUser.specialization,
        availability: this.currentUser.availability,
        consultationFee: this.currentUser.consultationFee
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset form to original values when canceling edit
      this.loadProfileData();
    }
  }

  onSubmit(): void {
    if (!this.currentUser || this.isUpdating) return;

    // Check form validity based on user role
    if (this.userRole === 'PATIENT' && this.profileForm.invalid) return;
    if (this.userRole === 'DOCTOR' && this.profileForm.invalid) return;

    if (this.userRole === 'PATIENT') {
      this.updatePatientProfile();
    } else if (this.userRole === 'DOCTOR') {
      this.updateDoctorProfile();
    } else if (this.userRole === 'ADMIN') {
      // Admin users don't have specific fields to update
      alert('Admin profile information cannot be edited through this interface.');
    }
  }

  private updatePatientProfile(): void {
    if (!this.currentUser || !this.currentUser.patientId) return;
    
    this.isUpdating = true;
    const updateData: PatientUpdateRequest = {
      name: this.profileForm.value.name,
      age: this.profileForm.value.age || 0,
      contact: this.profileForm.value.phone
    };
    
    this.authService.updatePatient(this.currentUser.patientId, updateData).subscribe({
      next: (response) => {
        console.log('Patient updated successfully:', response);
        // Update localStorage
        localStorage.setItem('username', updateData.name);
        // Refresh profile data from backend
        this.fetchProfileData();
        alert('Profile updated successfully!');
        this.isEditing = false;
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error updating patient:', error);
        alert('Failed to update profile. Please try again.');
        this.isUpdating = false;
      }
    });
  }

  private updateDoctorProfile(): void {
    if (!this.currentUser || !this.currentUser.doctorId) return;
    
    this.isUpdating = true;
    const updateData: DoctorUpdateRequest = {
      name: this.profileForm.value.name,
      specialization: this.profileForm.value.specialization || '',
      availability: this.profileForm.value.availability || '',
      phone: this.profileForm.value.phone,
      consultationFee: this.profileForm.value.consultationFee || 0
    };
    
    this.authService.updateDoctor(this.currentUser.doctorId, updateData).subscribe({
      next: (response) => {
        console.log('Doctor updated successfully:', response);
        // Update localStorage
        localStorage.setItem('username', updateData.name);
        // Refresh profile data from backend
        this.fetchProfileData();
        alert('Profile updated successfully!');
        this.isEditing = false;
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error updating doctor:', error);
        alert('Failed to update profile. Please try again.');
        this.isUpdating = false;
      }
    });
  }

  goBack(): void {
    if (this.userRole === 'PATIENT') {
      this.router.navigate(['/patient-dashboard']);
    } else if (this.userRole === 'DOCTOR') {
      this.router.navigate(['/doctor-dashboard']);
    } else if (this.userRole === 'ADMIN') {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  getRoleDisplayName(): string {
    switch (this.userRole) {
      case 'PATIENT': return 'Patient';
      case 'DOCTOR': return 'Doctor';
      case 'ADMIN': return 'Administrator';
      default: return 'User';
    }
  }
}
