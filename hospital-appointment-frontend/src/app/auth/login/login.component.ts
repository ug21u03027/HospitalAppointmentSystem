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

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    const payload: LoginRequest = { username: this.username, password: this.password };
    this.auth.login(payload).subscribe({
      next: (res) => {
        const role = res.role;
        if (role === 'ADMIN') this.router.navigate(['/admin-dashboard']);
        else if (role === 'DOCTOR') this.router.navigate(['/doctor-dashboard']);
        else this.router.navigate(['/patient-dashboard']);
      },
      error: () => {
        this.messageColor = 'red';
        this.message = 'Invalid credentials.';
      }
    });
  }
}
