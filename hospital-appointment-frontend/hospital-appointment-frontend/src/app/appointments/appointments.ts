import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HospitalService, Appointment, Patient, Doctor } from '../services/hospital';

@Component({
  selector: 'app-appointments',
  standalone: false,
  templateUrl: './appointments.html',
  styleUrls: ['./appointments.css']
})

export class Appointments implements OnInit {
  patientAppointments: Appointment[] = [];
  currentPatient: Patient | null = null;
  doctors: Doctor[] = [];

  constructor(
    private hospitalService: HospitalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentPatient = this.hospitalService.getCurrentPatient();
    this.doctors = this.hospitalService.getDoctors();

    if (!this.currentPatient) {
      this.router.navigate(['/login']);
    }

    this.loadAppointments();
  }

  loadAppointments(): void {
    const appointments = this.hospitalService.getAppointments();
    this.patientAppointments = appointments
      .filter(a => a.patientId === this.currentPatient!.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getDoctorName(doctorId: number): string {
    const doctor = this.doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Approved': return 'status-approved';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  viewAppointment(appt: Appointment): void {
    // Optional: Implement a detailed view modal or page
    alert(`Appointment with ${this.getDoctorName(appt.doctorId)} on ${appt.date} at ${appt.time}\nReason: ${appt.reason}\nStatus: ${appt.status}`);
  }

  cancelAppointment(appt: Appointment): void {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    appt.status = 'Cancelled';
    this.hospitalService.updateAppointment(appt);
    this.loadAppointments();
    alert('Appointment cancelled successfully.');
  }
  
  bookFirstAppointment(): void {
    this.router.navigate(['/book-appointment']);
  }
   logout(): void {
    this.hospitalService.logout();
    this.router.navigate(['/login']);
  }
  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }

}

