import { Injectable } from '@angular/core';

export interface Patient {
  patientId: number;
  name: string;
  age: number;
  contact: string;
  userId: number;
  // Additional fields for frontend compatibility
  email?: string;
  sex?: string;
  dob?: string;
  password?: string;
  createdAt?: string;
}

export interface Doctor {
  doctorId: number;
  name: string;
  specialization: string;
  availability: string;
  phone: string;
  consultationFee: number;
  status: string;
  // Additional fields for frontend compatibility
  id?: number; // Keep for backward compatibility
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  symptoms: string;
  status: 'PENDING' | 'APPROVED' | 'CANCELLED';
  createdAt: string;
  // Additional fields for frontend compatibility
  reason?: string; // Keep for backward compatibility
}

@Injectable({ providedIn: 'root' })
export class HospitalService {
  private doctors: Doctor[] = [
    { 
      doctorId: 1, 
      id: 1, // Backward compatibility
      name: 'Sarah Johnson', 
      specialization: 'Cardiology',
      availability: 'Monday-Friday 9AM-5PM',
      phone: '+1-555-0101',
      consultationFee: 150.00,
      status: 'ACTIVE'
    },
    { 
      doctorId: 2, 
      id: 2, // Backward compatibility
      name: 'Michael Chen', 
      specialization: 'Neurology',
      availability: 'Monday-Friday 8AM-4PM',
      phone: '+1-555-0102',
      consultationFee: 175.00,
      status: 'ACTIVE'
    },
    { 
      doctorId: 3, 
      id: 3, // Backward compatibility
      name: 'Emily Williams', 
      specialization: 'Pediatrics',
      availability: 'Monday-Friday 9AM-5PM',
      phone: '+1-555-0103',
      consultationFee: 125.00,
      status: 'ACTIVE'
    },
    { 
      doctorId: 4, 
      id: 4, // Backward compatibility
      name: 'David Kim', 
      specialization: 'Orthopedics',
      availability: 'Monday-Friday 8AM-6PM',
      phone: '+1-555-0104',
      consultationFee: 200.00,
      status: 'ACTIVE'
    },
    { 
      doctorId: 5, 
      id: 5, // Backward compatibility
      name: 'Lisa Rodriguez', 
      specialization: 'Dermatology',
      availability: 'Monday-Friday 10AM-6PM',
      phone: '+1-555-0105',
      consultationFee: 160.00,
      status: 'ACTIVE'
    }
  ];

  constructor() {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  getDoctors(): Doctor[] {
    return this.doctors;
  }

  updateDoctor(updated: Doctor): void {
    const index = this.doctors.findIndex(d => d.doctorId === updated.doctorId);
    if (index !== -1) {
      this.doctors[index] = updated;
    }
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
    const index = patients.findIndex(p => p.patientId === updated.patientId);
    if (index !== -1) {
      patients[index] = updated;
      localStorage.setItem('patients', JSON.stringify(patients));
    }
  }

  getAppointments(): Appointment[] {
    if (!this.isBrowser()) return [];
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
    const appointments = this.getAppointments();
    const index = appointments.findIndex(a => a.id === updated.id);
    if (index !== -1) {
      appointments[index] = updated;
      localStorage.setItem('appointments', JSON.stringify(appointments));
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
    if (!this.isBrowser()) return;
    localStorage.removeItem('currentPatient');
  }
}


