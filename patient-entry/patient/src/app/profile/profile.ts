import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HospitalService, Patient } from '../services/hospital';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})

export class Profile implements OnInit {
  profileForm: FormGroup;
  currentPatient: Patient | null = null;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(1)]],
      sex: ['', Validators.required],
      dob: ['', Validators.required],
      newPassword: ['']
    });
  }

  ngOnInit(): void {
    this.currentPatient = this.hospitalService.getCurrentPatient();
    if (!this.currentPatient) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.profileForm.patchValue({
      name: this.currentPatient?.name,
      email: this.currentPatient?.email,
      phone: this.currentPatient?.phone,
      age: this.currentPatient?.age,
      sex: this.currentPatient?.sex,
      dob: this.currentPatient?.dob,
      newPassword: ''
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.currentPatient) return;

    const patients = this.hospitalService.getPatients();
    const patientIndex = patients.findIndex(p => p.id === this.currentPatient!.id);

    if (patientIndex !== -1) {
      const updatedPatient: Patient = {
       ...this.currentPatient,
        name: this.profileForm.value.name,
        phone: this.profileForm.value.phone,
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
      this.router.navigate(['/dashboard']);
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}