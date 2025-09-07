import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  message = '';
  messageColor = 'red';

  constructor(private auth: AuthService, private router: Router) {}

  signup() {
    const result = this.auth.register({ name: this.name, email: this.email, password: this.password });
    if (result.success) {
      this.messageColor = 'green';
      this.message = 'Signup successful! Please login.';

      // Use async navigation to avoid IDE warning
      setTimeout(() => {
        this.router.navigateByUrl('/login'); // ✅ navigate to login after signup
      }, 1500);
    } else {
      this.messageColor = 'red';
      this.message = result.message || '';
    }
  }
}
