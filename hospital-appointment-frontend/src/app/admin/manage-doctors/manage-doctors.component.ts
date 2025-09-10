import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, UserProfile } from '../../services/user.service';
import { SpecializationService, SpecializationOption } from '../../services/specialization.service';

@Component({
  selector: 'app-manage-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-doctors.html',
  styleUrls: ['./manage-doctors.css']
})
export class ManageDoctorsComponent implements OnInit {
  allUsers: UserProfile[] = [];
  searchResults: UserProfile[] = [];
  selectedUser: UserProfile | null = null;
  searchQuery = '';
  selectedSpecialization = '';
  specializations: SpecializationOption[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private specializationService: SpecializationService
  ) {}

  ngOnInit(): void {
    this.loadAllUsers();
    this.specializations = this.specializationService.getSpecializations();
  }

  private loadAllUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Failed to load users: ${error.message}`;
        this.isLoading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim() && !this.selectedSpecialization) {
      this.searchResults = [];
      this.selectedUser = null;
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.searchResults = this.allUsers.filter(user => {
      // Must be a doctor
      if (user.role !== 'DOCTOR') {
        return false;
      }

      // Check specialization filter
      if (this.selectedSpecialization && user.specialization !== this.selectedSpecialization) {
        return false;
      }

      // Check text search (if provided)
      if (query) {
        return user.name.toLowerCase().includes(query) ||
               user.email.toLowerCase().includes(query) ||
               (user.phone && user.phone.toLowerCase().includes(query));
      }

      // If only specialization filter is applied
      return true;
    });

    // If only one result, auto-select it
    if (this.searchResults.length === 1) {
      this.selectedUser = this.searchResults[0];
      // If this is a doctor user, fetch additional doctor details
      if (this.selectedUser.role === 'DOCTOR' && this.selectedUser.doctorId) {
        this.loadDoctorDetails(this.selectedUser.doctorId);
      }
    } else {
      this.selectedUser = null;
    }
  }

  selectUser(user: UserProfile): void {
    this.selectedUser = user;
    this.searchResults = [user]; // Show only the selected user
    console.log('Selected user:', user);
    console.log('User accountStatus:', user.accountStatus);
    
    // If this is a doctor user, fetch additional doctor details
    if (user.role === 'DOCTOR' && user.doctorId) {
      this.loadDoctorDetails(user.doctorId);
    }
  }

  private loadDoctorDetails(doctorId: number): void {
    this.isLoading = true;
    this.userService.getDoctorById(doctorId).subscribe({
      next: (doctorDetails) => {
        // Merge the doctor details with the selected user
        if (this.selectedUser) {
          this.selectedUser = {
            ...this.selectedUser,
            specialization: doctorDetails.specialization,
            availability: doctorDetails.availability,
            consultationFee: doctorDetails.consultationFee
          };
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading doctor details:', error);
        this.isLoading = false;
        // Don't show error to user as basic info is still available
      }
    });
  }

  onSpecializationChange(): void {
    this.onSearch();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.selectedSpecialization = '';
    this.searchResults = [];
    this.selectedUser = null;
  }

  blockUser(user: UserProfile): void {
    if (!confirm(`Are you sure you want to block ${user.name}?`)) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.blockUser(user.userId).subscribe({
      next: (updatedUser) => {
        // Update the user in our local arrays
        this.updateUserInArrays(updatedUser);
        this.successMessage = `User ${updatedUser.name} has been blocked successfully.`;
        this.isLoading = false;
        this.clearMessages();
      },
      error: (error) => {
        this.errorMessage = `Failed to block user: ${error.message}`;
        this.isLoading = false;
        console.error('Error blocking user:', error);
      }
    });
  }

  activateUser(user: UserProfile): void {
    if (!confirm(`Are you sure you want to activate ${user.name}?`)) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.activateUser(user.userId).subscribe({
      next: (updatedUser) => {
        // Update the user in our local arrays
        this.updateUserInArrays(updatedUser);
        this.successMessage = `User ${updatedUser.name} has been activated successfully.`;
        this.isLoading = false;
        this.clearMessages();
      },
      error: (error) => {
        this.errorMessage = `Failed to activate user: ${error.message}`;
        this.isLoading = false;
        console.error('Error activating user:', error);
      }
    });
  }

  private updateUserInArrays(updatedUser: UserProfile): void {
    // Update in allUsers array
    const allUsersIndex = this.allUsers.findIndex(u => u.userId === updatedUser.userId);
    if (allUsersIndex > -1) {
      this.allUsers[allUsersIndex] = updatedUser;
    }

    // Update in searchResults array
    const searchResultsIndex = this.searchResults.findIndex(u => u.userId === updatedUser.userId);
    if (searchResultsIndex > -1) {
      this.searchResults[searchResultsIndex] = updatedUser;
    }

    // Update selectedUser if it's the same user
    if (this.selectedUser && this.selectedUser.userId === updatedUser.userId) {
      this.selectedUser = updatedUser;
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private clearMessages(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 5000);
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
