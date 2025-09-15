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
import { RecommendSpecialistComponent } from './recommend-specialist/recommend-specialist.component';

export const routes: Routes = [
  // Public routes (no authentication required)
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  
  // Protected routes - Patient (require authentication)
  { path: 'patient-dashboard', component: PatientDashboardComponent, canActivate: [AuthGuard] },
  { path: 'book-appointment', component: BookAppointmentComponent, canActivate: [AuthGuard] },
  { path: 'appointments', component: AppointmentsComponent, canActivate: [AuthGuard] },
  { path: 'recommend-specialist', component: RecommendSpecialistComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ViewProfileComponent, canActivate: [AuthGuard] },
  
  // Protected routes - Doctor (require authentication)
  { path: 'doctor-dashboard', component: DoctorDashboardComponent, canActivate: [AuthGuard] },
  { path: 'doctor/appointments', component: DoctorAppointmentsComponent, canActivate: [AuthGuard] },
  { path: 'doctor/patient-history', component: PatientHistoryComponent, canActivate: [AuthGuard] },
  
  // Protected routes - Admin (require authentication)
  { path: 'admin-dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'manage-doctors', component: ManageDoctorsComponent, canActivate: [AuthGuard] },
  { path: 'manage-patients', component: ManagePatientsComponent, canActivate: [AuthGuard] },
  
  // Root and fallback routes
  { path: '', component: AuthCheckComponent },
  { path: '**', component: AuthCheckComponent }
];
