import { Component } from '@angular/core';
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
export class LoginComponent {
  username = '';
  password = '';
  message = '';
  messageColor = 'red';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (this.isLoading) return;
    
    if (!this.username.trim() || !this.password.trim()) {
      this.messageColor = 'red';
      this.message = 'Please enter both username and password.';
      return;
    }

    this.isLoading = true;
    this.message = '';
    
    const payload: LoginRequest = { username: this.username, password: this.password };
    this.auth.login(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        const role = res.role;
        if (role === 'ADMIN') this.router.navigate(['/admin-dashboard']);
        else if (role === 'DOCTOR') this.router.navigate(['/doctor-dashboard']);
        else this.router.navigate(['/patient-dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.messageColor = 'red';
        
        // Check for specific account status messages from backend
        const backendMessage = error?.error?.message || '';
        
        if (backendMessage === 'User has not yet been verified') {
          this.message = 'Account is pending admin approval.';
        } else if (backendMessage === 'Account is blocked') {
          this.message = 'Account has been blocked.';
        } else {
          this.message = backendMessage || 'Invalid credentials.';
        }
      }
    });
  }
}
