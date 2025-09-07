import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 Add FormsModule here
  templateUrl: './manage-doctors.html',
  styleUrls: ['./manage-doctors.css']
})
export class ManageDoctorsComponent {
  doctors: any[] = [];
  currentDoctor = { id: null, name: '', specialty: '', email: '' };
  editingDoctor = false;

  addDoctor() {
    const newDoctor = { ...this.currentDoctor, id: Date.now() };
    this.doctors.push(newDoctor);
    this.resetForm();
  }

  editDoctor(doctor: any) {
    this.currentDoctor = { ...doctor };
    this.editingDoctor = true;
  }

  updateDoctor() {
    const index = this.doctors.findIndex(d => d.id === this.currentDoctor.id);
    if (index > -1) {
      this.doctors[index] = { ...this.currentDoctor };
    }
    this.resetForm();
  }

  deleteDoctor(id: number) {
    this.doctors = this.doctors.filter(d => d.id !== id);
  }

  resetForm() {
    this.currentDoctor = { id: null, name: '', specialty: '', email: '' };
    this.editingDoctor = false;
  }

  goBack() {
    window.history.back();
  }
}
