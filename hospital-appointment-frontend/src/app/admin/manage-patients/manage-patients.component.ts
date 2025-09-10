import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, UserProfile } from '../../services/user.service';

@Component({
  selector: 'app-manage-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-patients.html',
  styleUrls: ['./manage-patients.css']
})
export class ManagePatientsComponent implements OnInit {
  allUsers: UserProfile[] = [];
  searchResults: UserProfile[] = [];
  selectedUser: UserProfile | null = null;
  searchQuery = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadAllUsers();
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
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      this.selectedUser = null;
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.searchResults = this.allUsers.filter(user => 
      user.role === 'PATIENT' && (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phone && user.phone.toLowerCase().includes(query))
      )
    );

    // If only one result, auto-select it
    if (this.searchResults.length === 1) {
      this.selectedUser = this.searchResults[0];
    } else {
      this.selectedUser = null;
    }
  }

  selectUser(user: UserProfile): void {
    this.selectedUser = user;
    this.searchResults = [user]; // Show only the selected user
    console.log('Selected user:', user);
    console.log('User accountStatus:', user.accountStatus);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.selectedUser = null;
  }

  blockUser(user: UserProfile): void {
    if (!confirm(`Are you sure you want to block ${user.username}?`)) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.blockUser(user.userId).subscribe({
      next: (updatedUser) => {
        // Update the user in our local arrays
        this.updateUserInArrays(updatedUser);
        this.successMessage = `User ${updatedUser.username} has been blocked successfully.`;
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
    if (!confirm(`Are you sure you want to activate ${user.username}?`)) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.activateUser(user.userId).subscribe({
      next: (updatedUser) => {
        // Update the user in our local arrays
        this.updateUserInArrays(updatedUser);
        this.successMessage = `User ${updatedUser.username} has been activated successfully.`;
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
