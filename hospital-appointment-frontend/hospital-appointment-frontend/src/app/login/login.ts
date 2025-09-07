import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HospitalService } from '../services/hospital';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
   showPassword = false;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      remember: [false]
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;
    this.authService.login({ username, password }).subscribe({
      next: (res) => {
        const role = res.role;
        if (role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'DOCTOR') {
          this.router.navigate(['/doctor-dashboard']);
        } else {
          this.router.navigate(['/patient-dashboard']);
        }
      },
      error: () => {
        alert('Login failed. Please check your credentials.');
      }
    });
  }
  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
}
