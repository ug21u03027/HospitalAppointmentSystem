
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Appointment {
  id: number;
  patientName: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AppointmentsComponent {
  appointments: Appointment[] = [
    { id: 1, patientName: 'Alice', date: '2025-08-29', status: 'pending' },
    { id: 2, patientName: 'Bob', date: '2025-08-30', status: 'pending' },
    { id: 3, patientName: 'Charlie', date: '2025-08-31', status: 'pending' },
    { id: 4, patientName: 'Diana', date: '2025-09-01', status: 'pending' },
    { id: 5, patientName: 'Ethan', date: '2025-09-02', status: 'pending' },
    { id: 6, patientName: 'Fiona', date: '2025-09-03', status: 'pending' },
    { id: 7, patientName: 'George', date: '2025-09-04', status: 'pending' }
  ];

  markCompleted(id: number) {
    const appt = this.appointments.find(a => a.id === id);
    if (appt) appt.status = 'completed';
  }

  markCancelled(id: number) {
    const appt = this.appointments.find(a => a.id === id);
    if (appt) appt.status = 'cancelled';
  }

  goBack() {
    window.history.back();
  }
}
