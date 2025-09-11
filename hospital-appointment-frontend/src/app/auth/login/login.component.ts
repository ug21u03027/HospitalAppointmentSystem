import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ make standalone
  imports: [CommonModule, FormsModule, RouterModule], // ✅ import needed modules
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  message = '';
  messageColor = 'red';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check if user is already authenticated
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    
    if (token && role) {
      // User is already authenticated, redirect to appropriate dashboard
      this.redirectToDashboard(role);
    }
  }

  login() {
    const payload: LoginRequest = { username: this.username, password: this.password };
    this.auth.login(payload).subscribe({
      next: (res) => {
        this.redirectToDashboard(res.role);
      },
      error: () => {
        this.messageColor = 'red';
        this.message = 'Invalid credentials.';
      }
    });
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
