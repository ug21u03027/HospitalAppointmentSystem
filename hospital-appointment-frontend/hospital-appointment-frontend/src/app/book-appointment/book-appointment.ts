import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HospitalService, Doctor, Appointment, Patient } from '../services/hospital';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-appointment',
  standalone: false,
  templateUrl: './book-appointment.html',
  styleUrls: ['./book-appointment.css']
})

export class BookAppointment implements OnInit {
  appointmentForm: FormGroup;
  doctors: Doctor[] = [];
  currentPatient: Patient | null = null;
  today: string = '';
  availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      doctorId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      reason: ['']
    });
  }

  ngOnInit(): void {
    this.doctors = this.hospitalService.getDoctors();
    this.currentPatient = this.hospitalService.getCurrentPatient();
    if (!this.currentPatient) {
      this.router.navigate(['/login']);
    }
    this.today = new Date().toISOString().split('T')[0];
  }

  onBook(): void {
    if (this.appointmentForm.invalid || !this.currentPatient) return;

    const newAppointment: Appointment = {
      id: Date.now(),
      patientId: this.currentPatient.id,
      doctorId: +this.appointmentForm.value.doctorId,
      date: this.appointmentForm.value.date,
      time: this.appointmentForm.value.time,
      reason: this.appointmentForm.value.reason || '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    this.hospitalService.saveAppointment(newAppointment);
    alert('Appointment booked successfully! Status: Pending');
    this.router.navigate(['/appointments']);
  }
  logout(): void {
    this.hospitalService.logout();
    this.router.navigate(['/login']);
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
