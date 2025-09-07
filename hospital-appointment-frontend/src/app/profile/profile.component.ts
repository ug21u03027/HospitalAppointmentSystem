import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HospitalService, Patient } from '../services/hospital';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentPatient: Patient | null = null;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private router: Router,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(1)]],
      sex: ['', Validators.required],
      dob: ['', Validators.required],
      newPassword: ['']
    });
  }

  ngOnInit(): void {
    // Check authentication using the same method as patient dashboard
    this.checkAuthStatus();
    this.loadProfileData();
  }

  private checkAuthStatus(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const role = localStorage.getItem('role');
      
      if (!token || role !== 'PATIENT') {
        this.router.navigate(['/login']);
        return;
      }
      
      // Create a mock patient object from localStorage data for compatibility
      this.currentPatient = {
        patientId: parseInt(localStorage.getItem('userId') || '0'),
        userId: parseInt(localStorage.getItem('userId') || '0'),
        name: localStorage.getItem('username') || 'Patient',
        age: 0,
        contact: '',
        email: localStorage.getItem('email') || '',
        sex: '',
        dob: '',
        password: '',
        createdAt: new Date().toISOString()
      };
    }
  }

  loadProfileData(): void {
    this.profileForm.patchValue({
      name: this.currentPatient?.name,
      email: this.currentPatient?.email,
      phone: this.currentPatient?.contact,
      age: this.currentPatient?.age,
      sex: this.currentPatient?.sex,
      dob: this.currentPatient?.dob,
      newPassword: ''
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.currentPatient) return;
    const patients = this.hospitalService.getPatients();
    const patientIndex = patients.findIndex(p => p.patientId === this.currentPatient!.patientId);
    if (patientIndex !== -1) {
      const updatedPatient: Patient = {
        ...this.currentPatient,
        name: this.profileForm.value.name,
        contact: this.profileForm.value.phone,
        age: this.profileForm.value.age,
        sex: this.profileForm.value.sex,
        dob: this.profileForm.value.dob
      };
      if (this.profileForm.value.newPassword) {
        updatedPatient.password = this.profileForm.value.newPassword;
      }
      this.hospitalService.updatePatient(updatedPatient);
      this.hospitalService.setCurrentPatient(updatedPatient);
      alert('Profile updated successfully!');
      this.router.navigate(['/patient-dashboard']);
    }
  }

  cancel(): void {
    this.router.navigate(['/patient-dashboard']);
  }
}


