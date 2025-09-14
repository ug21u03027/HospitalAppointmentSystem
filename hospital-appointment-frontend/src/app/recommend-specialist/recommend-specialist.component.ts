import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface RecommendSpecialistRequest {
  symptoms: string;
  base64Image: string;
}

// Backend returns DoctorSpecialization enum directly
type RecommendSpecialistResponse = string;

@Component({
  selector: 'app-recommend-specialist',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './recommend-specialist.component.html',
  styleUrls: ['./recommend-specialist.component.css']
})
export class RecommendSpecialistComponent implements OnInit {
  recommendForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  recommendedSpecialization: string | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.recommendForm = this.fb.group({
      symptoms: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const role = localStorage.getItem('role');
      
      if (!token || role !== 'PATIENT') {
        this.router.navigate(['/login']);
        return;
      }
      
      this.isLoggedIn = true;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Check file size (3MB = 3 * 1024 * 1024 bytes)
      if (file.size > 3 * 1024 * 1024) {
        this.errorMessage = 'File size must be less than 3MB';
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select an image file';
        return;
      }
      
      this.selectedFile = file;
      this.errorMessage = '';
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    // Reset the file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  async onSubmit(): Promise<void> {
    if (this.recommendForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.recommendedSpecialization = null;

      try {
        let base64Image = '';
        
        if (this.selectedFile) {
          base64Image = await this.convertFileToBase64(this.selectedFile);
        }

        const request: RecommendSpecialistRequest = {
          symptoms: this.recommendForm.get('symptoms')?.value,
          base64Image: base64Image
        };

        const token = localStorage.getItem('accessToken');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        const response = await this.http.post<RecommendSpecialistResponse>(
          `http://localhost:8080/api/patients/specialist`,
          request,
          { headers }
        ).toPromise();

        if (response) {
          console.log('Received specialization response:', response);
          this.recommendedSpecialization = response;
          this.successMessage = 'Specialist recommendation received successfully!';
        }
      } catch (error: any) {
        console.error('Error getting specialist recommendation:', error);
        this.errorMessage = error.error?.message || 'Failed to get specialist recommendation. Please try again.';
      } finally {
        this.isLoading = false;
      }
    }
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  onBookAppointment(): void {
    if (this.recommendedSpecialization) {
      const symptoms = this.recommendForm.get('symptoms')?.value || '';
      console.log('Navigating to book appointment with specialization:', this.recommendedSpecialization);
      console.log('Prefilling symptoms:', symptoms);
      // Navigate to book appointment page with pre-selected specialization and symptoms
      this.router.navigate(['/book-appointment'], {
        queryParams: { 
          specialization: this.recommendedSpecialization,
          symptoms: symptoms
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/patient-dashboard']);
  }

  formatSpecialization(specialization: string): string {
    return specialization.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
