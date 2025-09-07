import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuthStatus();
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
}


