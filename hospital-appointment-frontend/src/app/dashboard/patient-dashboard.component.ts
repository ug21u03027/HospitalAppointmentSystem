import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppointmentService, AppointmentDto, UserProfile } from '../services/appointment.service';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  userName: string = 'Guest';
  isLoggedIn: boolean = false;
  
  // Quick stats data
  upcomingAppointments: number = 0;
  doctorsConsulted: number = 0;
  totalVisits: number = 0;
  isLoadingStats: boolean = true;
  
  // Navigation menu state
  isNavMenuOpen: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
    this.loadQuickStats();
  }

  private checkAuthStatus(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const role = localStorage.getItem('role');
      const username = localStorage.getItem('username');
      
      if (!token || role !== 'PATIENT') {
        this.router.navigate(['/login']);
        return;
      }
      
      this.isLoggedIn = true;
      this.userName = username || 'Patient';
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenType');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('userId');
    }
    this.router.navigate(['/login']);
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }

  // Specific navigation methods for better clarity
  navigateToBookAppointment(): void {
    this.router.navigate(['/book-appointment']);
  }

  navigateToAppointments(): void {
    this.router.navigate(['/appointments']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  navigateToRecommendSpecialist(): void {
    this.router.navigate(['/recommend-specialist']);
  }

  private loadQuickStats(): void {
    this.isLoadingStats = true;
    
    // First get user profile to get patient ID
    this.appointmentService.getUserProfile().subscribe({
      next: (profile: UserProfile) => {
        if (profile.patientId) {
          // Get patient appointments
          this.appointmentService.getPatientAppointments(profile.patientId).subscribe({
            next: (appointments: AppointmentDto[]) => {
              this.calculateStats(appointments);
              this.isLoadingStats = false;
            },
            error: (error) => {
              console.error('Error loading appointments:', error);
              this.isLoadingStats = false;
            }
          });
        } else {
          this.isLoadingStats = false;
        }
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.isLoadingStats = false;
      }
    });
  }

  private calculateStats(appointments: AppointmentDto[]): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count upcoming appointments (APPROVED status and future date)
    this.upcomingAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointment.status === 'APPROVED' && appointmentDate >= today;
    }).length;

    // Count unique doctors consulted (COMPLETED appointments)
    const uniqueDoctors = new Set(
      appointments
        .filter(appointment => appointment.status === 'COMPLETED')
        .map(appointment => appointment.doctorId)
    );
    this.doctorsConsulted = uniqueDoctors.size;

    // Count total visits (COMPLETED appointments)
    this.totalVisits = appointments.filter(appointment => 
      appointment.status === 'COMPLETED'
    ).length;
  }

  // Toggle navigation menu
  toggleNavMenu(): void {
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }

  // Listen for window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    // If screen width is greater than 768px (desktop), show the menu
    if (event.target.innerWidth > 768) {
      this.isNavMenuOpen = true;
    }
  }
}


