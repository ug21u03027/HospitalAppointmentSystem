import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],  // ✅ important
  templateUrl: './manage-patients.html',
  styleUrls: ['./manage-patients.css']
})
export class ManagePatientsComponent {
  patients: any[] = [];
  editingPatient = false;

  // patient object for form binding
  currentPatient = { id: 0, name: '', age: 0, email: '' };

  constructor(private router: Router) {}

  addPatient() {
    const newId = this.patients.length + 1;
    this.patients.push({ ...this.currentPatient, id: newId });
    this.resetForm();
  }

  updatePatient() {
    const index = this.patients.findIndex(p => p.id === this.currentPatient.id);
    if (index > -1) {
      this.patients[index] = { ...this.currentPatient };
    }
    this.resetForm();
  }

  editPatient(patient: any) {
    this.currentPatient = { ...patient };
    this.editingPatient = true;
  }

  deletePatient(id: number) {
    this.patients = this.patients.filter(p => p.id !== id);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  private resetForm() {
    this.currentPatient = { id: 0, name: '', age: 0, email: '' };
    this.editingPatient = false;
  }
}
