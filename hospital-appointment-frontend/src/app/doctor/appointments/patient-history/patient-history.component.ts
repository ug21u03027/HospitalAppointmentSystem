
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Patient {
  id: number;
  name: string;
  lastVisit: string;
  diagnosis: string;
}

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PatientHistoryComponent {
  patients: Patient[] = [
    { id: 1, name: 'Alice', lastVisit: '2025-08-10', diagnosis: 'Flu' },
    { id: 2, name: 'Bob', lastVisit: '2025-07-22', diagnosis: 'Diabetes' },
    { id: 3, name: 'Charlie', lastVisit: '2025-08-15', diagnosis: 'Hypertension' },
    { id: 4, name: 'Diana', lastVisit: '2025-08-18', diagnosis: 'Asthma' },
    { id: 5, name: 'Ethan', lastVisit: '2025-08-20', diagnosis: 'Allergy' },
    { id: 6, name: 'Fiona', lastVisit: '2025-08-25', diagnosis: 'Migraine' },
    { id: 7, name: 'George', lastVisit: '2025-08-28', diagnosis: 'Back Pain' }
  ];
  goBack() {
    window.history.back();
  }
}
