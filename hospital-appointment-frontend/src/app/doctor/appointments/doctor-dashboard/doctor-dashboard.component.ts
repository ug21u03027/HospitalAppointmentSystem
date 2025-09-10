
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, UserProfile } from '../../../services/auth.service';
import { AppointmentService } from '../../../services/appointment.service';
import { SpecializationService } from '../../../services/specialization.service';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule]
})
export class DoctorDashboardComponent implements OnInit {
  userProfile: UserProfile | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private specializationService: SpecializationService,
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
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Failed to load user profile: ${error.message}`;
        this.isLoading = false;
        console.error('Error loading user profile:', error);
      }
    });
  }

  navigateToAppointments() {
    this.router.navigate(['/doctor/appointments']);
  }

  navigateToPatientHistory() {
    this.router.navigate(['/doctor/patient-history']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getSpecializationLabel(specialization: string): string {
    return this.specializationService.getSpecializationLabel(specialization);
  }
}
