import { Injectable } from '@angular/core';

export interface SpecializationOption {
  value: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {
  
  private specializations: SpecializationOption[] = [
    { value: 'GENERAL_PHYSICIAN', label: 'General Physician' },
    { value: 'PEDIATRICIAN', label: 'Pediatrician' },
    { value: 'CARDIOLOGIST', label: 'Cardiologist' },
    { value: 'DERMATOLOGIST', label: 'Dermatologist' },
    { value: 'NEUROLOGIST', label: 'Neurologist' },
    { value: 'PSYCHIATRIST', label: 'Psychiatrist' },
    { value: 'ORTHOPEDIC_SURGEON', label: 'Orthopedic Surgeon' },
    { value: 'GYNECOLOGIST', label: 'Gynecologist' },
    { value: 'ENT_SPECIALIST', label: 'ENT Specialist' },
    { value: 'ONCOLOGIST', label: 'Oncologist' },
    { value: 'UROLOGIST', label: 'Urologist' },
    { value: 'OPHTHALMOLOGIST', label: 'Ophthalmologist' },
    { value: 'GASTROENTEROLOGIST', label: 'Gastroenterologist' },
    { value: 'PULMONOLOGIST', label: 'Pulmonologist' },
    { value: 'ENDOCRINOLOGIST', label: 'Endocrinologist' },
    { value: 'RADIOLOGIST', label: 'Radiologist' },
    { value: 'DENTIST', label: 'Dentist' },
    { value: 'SURGEON', label: 'Surgeon' }
  ];

  getSpecializations(): SpecializationOption[] {
    return this.specializations;
  }

  getSpecializationLabel(value: string): string {
    const specialization = this.specializations.find(s => s.value === value);
    return specialization ? specialization.label : value;
  }

  getSpecializationValue(label: string): string {
    const specialization = this.specializations.find(s => s.label === label);
    return specialization ? specialization.value : label;
  }
}
