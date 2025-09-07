import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ make standalone
  imports: [CommonModule, FormsModule, RouterModule], // ✅ import needed modules
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';
  messageColor = 'red';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    const result = this.auth.login(this.email, this.password);
    if (result.success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.messageColor = 'red';
      this.message = result.message || '';
    }
  }
}
