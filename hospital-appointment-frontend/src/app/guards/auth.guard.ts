import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    
    if (token && role) {
      // User is authenticated, redirect to appropriate dashboard
      this.redirectToDashboard(role);
      return false; // Prevent navigation to the guarded route
    }
    
    // User is not authenticated, allow navigation to login
    return true;
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
        this.router.navigate(['/login']);
    }
  }
}
