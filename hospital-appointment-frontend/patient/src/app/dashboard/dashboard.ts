import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HospitalService, Patient } from '../services/hospital';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})


export class Dashboard implements OnInit {
  currentPatient: Patient | null = null;
  userName: string = 'Guest'; 

  constructor(
    private hospitalService: HospitalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentPatient = this.hospitalService.getCurrentPatient();
    if (!this.currentPatient) {
      this.router.navigate(['/login']);
    }else {
      this.userName = this.currentPatient.name; 
    }
  }

  logout(): void {
    this.hospitalService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
