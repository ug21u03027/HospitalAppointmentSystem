import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HospitalService, Patient } from '../services/hospital';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(1)]],
      sex: ['', Validators.required],
      dob: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid)  {
      alert('Please fill all fields correctly.');
      return;
    }

    const patients = this.hospitalService.getPatients();
    const email = this.registerForm.value.email;
    if (patients.find(p => p.email === email)) {
      alert('Email already registered. Please login.');
      return;
    }

    const newPatient: Patient = {
      id: Date.now(),
      ...this.registerForm.value,
      createdAt: new Date().toISOString()
    };

    this.hospitalService.savePatient(newPatient);
    alert('Registration successful! Please login.');
  this.router.navigate(['/login']);

  }
  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
}