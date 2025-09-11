import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-check',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-check-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    </div>
  `,
  styles: [`
    .auth-check-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    
    .loading-spinner {
      text-align: center;
    }
    
    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    p {
      color: #666;
      font-size: 16px;
    }
  `]
})
export class AuthCheckComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthenticationStatus();
  }

  private checkAuthenticationStatus(): void {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    
    if (token && role) {
      // User is authenticated, validate token and redirect
      this.validateTokenAndRedirect(role);
    } else {
      // No token or role, redirect to login
      this.router.navigate(['/login']);
    }
  }

  private validateTokenAndRedirect(role: string): void {
    // Optionally validate token with backend
    // For now, we'll trust the localStorage and redirect
    this.redirectToDashboard(role);
  }

  private redirectToDashboard(role: string): void {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'DOCTOR':
        this.router.navigate(['/doctor-dashboard']);
        break;
      case 'PATIENT':
        this.router.navigate(['/patient-dashboard']);
        break;
      default:
        // Invalid role, clear storage and redirect to login
        this.authService.logout();
        this.router.navigate(['/login']);
    }
  }
}
