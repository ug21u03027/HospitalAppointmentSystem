import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageDoctorsComponent } from './admin/manage-doctors/manage-doctors.component';
import { ManagePatientsComponent } from './admin/manage-patients/manage-patients.component';
import { PatientDashboardComponent } from './dashboard/patient-dashboard.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'patient-dashboard', component: PatientDashboardComponent },
  { path: 'doctor-dashboard', component: DashboardComponent },
  { path: 'admin-dashboard', component: DashboardComponent },
  { path: 'book-appointment', component: BookAppointmentComponent },
  { path: 'appointments', component: AppointmentsComponent },
  { path: 'profile', component: ViewProfileComponent },
  { path: 'manage-doctors', component: ManageDoctorsComponent },
  { path: 'manage-patients', component: ManagePatientsComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
