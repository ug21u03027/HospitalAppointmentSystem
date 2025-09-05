import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HospitalService, Patient } from '../services/hospital';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const patients = this.hospitalService.getPatients();
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    const patient = patients.find(p => p.email === email && p.password === password);

    if (patient) {
      this.hospitalService.setCurrentPatient(patient);
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid email or password. Please try again or register.');
    }
  }
  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
}
