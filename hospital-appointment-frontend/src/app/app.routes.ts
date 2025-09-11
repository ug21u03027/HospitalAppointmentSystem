import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthCheckComponent } from './auth-check/auth-check.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageDoctorsComponent } from './admin/manage-doctors/manage-doctors.component';
import { ManagePatientsComponent } from './admin/manage-patients/manage-patients.component';
import { PatientDashboardComponent } from './dashboard/patient-dashboard.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { DoctorDashboardComponent } from './doctor/appointments/doctor-dashboard/doctor-dashboard.component';
import { AppointmentsComponent as DoctorAppointmentsComponent } from './doctor/appointments/appointments.component';
import { PatientHistoryComponent } from './doctor/appointments/patient-history/patient-history.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent },
  
  // Protected routes - Patient
  { path: 'patient-dashboard', component: PatientDashboardComponent },
  { path: 'book-appointment', component: BookAppointmentComponent },
  { path: 'appointments', component: AppointmentsComponent },
  { path: 'profile', component: ViewProfileComponent },
  
  // Protected routes - Doctor
  { path: 'doctor-dashboard', component: DoctorDashboardComponent },
  { path: 'doctor/doctor-dashboard', component: DoctorDashboardComponent },
  { path: 'doctor/appointments', component: DoctorAppointmentsComponent },
  { path: 'doctor/patient-history', component: PatientHistoryComponent },
  
  // Protected routes - Admin
  { path: 'admin-dashboard', component: DashboardComponent },
  { path: 'manage-doctors', component: ManageDoctorsComponent },
  { path: 'manage-patients', component: ManagePatientsComponent },
  
  // Root and fallback routes
  { path: '', component: AuthCheckComponent },
  { path: '**', component: AuthCheckComponent }
];
