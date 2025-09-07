import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageDoctorsComponent } from './admin/manage-doctors/manage-doctors.component';
import { ManagePatientsComponent } from './admin/manage-patients/manage-patients.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'manage-doctors', component: ManageDoctorsComponent },
  { path: 'manage-patients', component: ManagePatientsComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
