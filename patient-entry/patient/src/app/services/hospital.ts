import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  sex: string;
  dob: string;
  password: string;
  createdAt: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Cancelled';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})



export class HospitalService {
  private doctors: Doctor[] = [
    { id: 1, name: 'Sarah Johnson', specialization: 'Cardiology' },
    { id: 2, name: 'Michael Chen', specialization: 'Neurology' },
    { id: 3, name: 'Emily Williams', specialization: 'Pediatrics' },
    { id: 4, name: 'David Kim', specialization: 'Orthopedics' },
    { id: 5, name: 'Lisa Rodriguez', specialization: 'Dermatology' }
  ];

  constructor() { }


  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  getDoctors(): Doctor[] {
    return this.doctors;
  }

  getPatients(): Patient[] {
    if (!this.isBrowser()) return [];
    return JSON.parse(localStorage.getItem('patients') || '[]');
  }

  savePatient(patient: Patient): void {
     if (!this.isBrowser()) return;
    const patients = this.getPatients();
    patients.push(patient);
    localStorage.setItem('patients', JSON.stringify(patients));
  }

  updatePatient(updated: Patient): void {
     if (!this.isBrowser()) return;
  const patients = this.getPatients();
  const index = patients.findIndex(p => p.id === updated.id);
  if (index !== -1) {
    patients[index] = updated;
    localStorage.setItem('patients', JSON.stringify(patients));
  }
}

  getAppointments(): Appointment[] {
     if (!this.isBrowser()) return[];
    return JSON.parse(localStorage.getItem('appointments') || '[]');
  }

  saveAppointment(appointment: Appointment): void {
     if (!this.isBrowser()) return;
    const appointments = this.getAppointments();
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }
  updateAppointment(updated: Appointment): void {
     if (!this.isBrowser()) return;
  const appointments = this.getAppointments(); // get all appointments
  const index = appointments.findIndex(a => a.id === updated.id);
  if (index !== -1) {
    appointments[index] = updated;
    localStorage.setItem('appointments', JSON.stringify(appointments)); // save back
  }
}



  getCurrentPatient(): Patient | null {
     if (!this.isBrowser()) return null;
    const patient = localStorage.getItem('currentPatient');
    return patient ? JSON.parse(patient) : null;
  }

  setCurrentPatient(patient: Patient): void {
     if (!this.isBrowser()) return;
    localStorage.setItem('currentPatient', JSON.stringify(patient));
  }

  logout(): void {
    localStorage.removeItem('currentPatient');
  }
}
