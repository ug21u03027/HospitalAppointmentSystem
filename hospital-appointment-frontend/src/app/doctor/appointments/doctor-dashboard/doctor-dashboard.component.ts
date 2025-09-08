
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChunkPipe } from './chunk.pipe';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ChunkPipe]
})
export class DoctorDashboardComponent {
  doctors = [
    { name: 'Dr. Sasikala', specialization: 'Cardiology', phone: '1234567890', email: 'sasikala@gmail.com', experience: 3 },
    { name: 'Dr. Subha', specialization: 'Neurology', phone: '2345678901', email: 'subha@gmail.com', experience: 3 },
    { name: 'Dr. Varshitha', specialization: 'Orthopedics', phone: '3456789012', email: 'varshitha@gmail.com', experience: 2 },
    { name: 'Dr. Subham Rathore', specialization: 'Pediatrics', phone: '4567890123', email: 'subham@gmail.com', experience: 3 },
    { name: 'Dr. Ujwal Gupta', specialization: 'ENT', phone: '5678901234', email: 'ujwal@gmail.com', experience: 2 },
    { name: 'Dr. Shashidhar', specialization: 'Psychiatry', phone: '6789012345', email: 'shashidhar@gmail.com', experience: 3 }
  ];
  editIndex: number | null = null;

  enableEdit(index: number) {
    this.editIndex = index;
  }

  saveProfile() {
    this.editIndex = null;
    // Save logic here
  }
  goBack() {
    window.history.back();
  }

  logout() {
    window.location.href = '/doctor-registration';
  }
}
