import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Register } from './register/register';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { BookAppointment } from './book-appointment/book-appointment';
import { Appointments } from './appointments/appointments';
import { Profile } from './profile/profile';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    App,
    Register,
    Login,
    Dashboard,
    BookAppointment,
    Appointments,
    Profile
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,          
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App]
})
export class AppModule { }
