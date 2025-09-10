import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  userName: string = 'Admin';
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const role = localStorage.getItem('role');
      const username = localStorage.getItem('username');
      
      if (!token || role !== 'ADMIN') {
        this.router.navigate(['/login']);
        return;
      }
      
      this.isLoggedIn = true;
      this.userName = username || 'Admin';
    }
  }

  navigateDoctors() {
    this.router.navigate(['/manage-doctors']);
  }

  navigatePatients() {
    this.router.navigate(['/manage-patients']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
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
}
