import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthService, RegisterRequest } from '../services/auth.service';


@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern(/^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,30}$/)
      ]],
      role: ['', Validators.required],
      // Common optional fields (role will add 'required' dynamically)
      name: ['', [Validators.minLength(1), Validators.maxLength(50), Validators.pattern(/^[A-Za-z ]+$/)]],
      age: [null, [Validators.min(1), Validators.max(150)]],
      contact: ['', [Validators.pattern(/^\d{10}$/)]],
      specialization: ['', [Validators.minLength(1), Validators.maxLength(100)]],
      availability: ['', [Validators.minLength(1), Validators.maxLength(50)]],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      consultationFee: [null, [this.numericRangeValidator(0.01, 50000)]]
    });
  }

  // Role-specific fields are optional; only base fields are required
  ngOnInit(): void {
    const roleCtrl = this.registerForm.get('role');
    roleCtrl?.valueChanges.subscribe((role) => {
      const name = this.registerForm.get('name');
      const age = this.registerForm.get('age');
      const contact = this.registerForm.get('contact');
      const specialization = this.registerForm.get('specialization');
      const availability = this.registerForm.get('availability');
      const phone = this.registerForm.get('phone');
      const consultationFee = this.registerForm.get('consultationFee');

      // reset back to base validators (min/max/pattern)
      name?.setValidators([Validators.minLength(1), Validators.maxLength(50), Validators.pattern(/^[A-Za-z ]+$/)]);
      age?.setValidators([Validators.min(1), Validators.max(150)]);
      contact?.setValidators([Validators.pattern(/^\d{10}$/)]);
      specialization?.setValidators([Validators.minLength(1), Validators.maxLength(100)]);
      availability?.setValidators([Validators.minLength(1), Validators.maxLength(50)]);
      phone?.setValidators([Validators.pattern(/^\d{10}$/)]);
      consultationFee?.setValidators([this.numericRangeValidator(0.01, 50000)]);

      if (role === 'PATIENT') {
        name?.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern(/^[A-Za-z ]+$/)]);
        age?.setValidators([Validators.required, Validators.min(1), Validators.max(150)]);
        contact?.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)]);
      } else if (role === 'DOCTOR') {
        name?.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern(/^[A-Za-z ]+$/)]);
        specialization?.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(100)]);
        phone?.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)]);
        consultationFee?.setValidators([Validators.required, this.numericRangeValidator(0.01, 50000)]);
        // availability optional
      } else if (role === 'ADMIN') {
        // no extra required fields
      }

      name?.updateValueAndValidity();
      age?.updateValueAndValidity();
      contact?.updateValueAndValidity();
      specialization?.updateValueAndValidity();
      availability?.updateValueAndValidity();
      phone?.updateValueAndValidity();
      consultationFee?.updateValueAndValidity();
    });
  }

  private numericRangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl) => {
      const raw = control.value;
      if (raw === null || raw === undefined || raw === '') return null;
      const value = typeof raw === 'number' ? raw : Number(String(raw).replace(/[^0-9.]/g, ''));
      if (Number.isNaN(value)) return { number: true };
      if (value < min) return { minNumber: { min } };
      if (value > max) return { maxNumber: { max } };
      return null;
    };
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.isSubmittable())  {
      alert('Please fill all required fields correctly.');
      return;
    }

    const formVal = this.registerForm.value;
    const payload: RegisterRequest = {
      username: formVal.username,
      email: formVal.email,
      password: formVal.password,
      role: formVal.role,
      name: formVal.name || undefined,
      age: formVal.age || undefined,
      contact: formVal.contact || undefined,
      specialization: formVal.specialization || undefined,
      availability: formVal.availability || undefined,
      phone: formVal.phone || undefined,
      consultationFee: formVal.consultationFee || undefined
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        if (res?.accessToken && res.role === 'PATIENT') {
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('tokenType', res.tokenType || 'Bearer');
            localStorage.setItem('role', res.role);
            localStorage.setItem('username', res.username);
            localStorage.setItem('email', res.email || '');
            localStorage.setItem('userId', String(res.userId));
          }
          this.router.navigate(['/patient-dashboard']);
        } else {
          alert(res?.message || 'Registration successful! Please login.');
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        alert(err?.error?.message || 'Registration failed. Please try again.');
      }
    });
  }

  isSubmittable(): boolean {
    const usernameValid = this.registerForm.get('username')?.valid;
    const emailValid = this.registerForm.get('email')?.valid;
    const passwordValid = this.registerForm.get('password')?.valid;
    const role = this.registerForm.get('role')?.value;
    if (!usernameValid || !emailValid || !passwordValid || !role) return false;

    if (role === 'PATIENT') {
      return !!(
        this.registerForm.get('name')?.value &&
        this.registerForm.get('age')?.value &&
        this.registerForm.get('contact')?.value
      );
    }
    if (role === 'DOCTOR') {
      return !!(
        this.registerForm.get('name')?.value &&
        this.registerForm.get('specialization')?.value &&
        this.registerForm.get('phone')?.value &&
        (this.registerForm.get('consultationFee')?.value || this.registerForm.get('consultationFee')?.value === 0)
      );
    }
    // ADMIN
    return true;
  }

  private ctrl(name: string) {
    return this.registerForm.get(name);
  }

  showError(name: string): boolean {
    const c = this.ctrl(name);
    return !!c && c.invalid && (c.touched || this.submitted);
  }

  fieldError(name: string): string | null {
    const c = this.ctrl(name);
    if (!c) return null;
    const errors = c.errors || {};
    if (errors['required']) return 'This field is required.';
    if (errors['email']) return 'Please enter a valid email address.';
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}.`;
    if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength}.`;
    if (errors['pattern']) {
      switch (name) {
        case 'name': return 'Only letters and spaces are allowed.';
        case 'contact': return 'Contact must be a 10-digit number.';
        case 'phone': return 'Phone must be a 10-digit number.';
        case 'password': return 'Password must include at least one number and one special character.';
        default: return 'Invalid format.';
      }
    }
    if (errors['min']) return `Minimum value is ${errors['min'].min}.`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}.`;
    if (errors['number']) return 'Enter a valid number.';
    if (errors['minNumber']) return `Minimum allowed is ${errors['minNumber'].min}.`;
    if (errors['maxNumber']) return `Maximum allowed is ${errors['maxNumber'].max}.`;
    return null;
  }

  getFormErrors(): string[] {
    const errs: string[] = [];
    const role = this.ctrl('role')?.value;
    const base: Array<[string,string]> = [
      ['username','Username (1-50 chars)'],
      ['email','Email (valid format)'],
      ['password','Password (6-30, 1 number & 1 special)'],
      ['role','Role']
    ];
    base.forEach(([k,label]) => { if (this.showError(k)) errs.push(`${label} is invalid or missing.`); });

    if (role === 'PATIENT') {
      [['name','Full Name (letters, 1-50)'], ['age','Age (1-150)'], ['contact','Contact (10 digits)']].forEach(([k,label]) => {
        if (this.showError(k)) errs.push(`${label} is invalid or missing.`);
      });
    } else if (role === 'DOCTOR') {
      [['name','Full Name (letters, 1-50)'], ['specialization','Specialization (1-100)'], ['phone','Phone (10 digits)'], ['consultationFee','Consultation Fee (0.01 - 50000)']]
        .forEach(([k,label]) => { if (this.showError(k)) errs.push(`${label} is invalid or missing.`); });
    }
    return errs;
  }
  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
}