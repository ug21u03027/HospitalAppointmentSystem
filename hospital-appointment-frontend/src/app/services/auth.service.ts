import { Injectable } from '@angular/core';

export interface User {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [];

  register(user: User) {
    const exists = this.users.find(u => u.email === user.email);
    if (exists) {
      return { success: false, message: 'User already exists. Please login.' };
    }
    this.users.push(user);
    return { success: true };
  }

  login(email: string, password: string) {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      return { success: true };
    } else {
      return { success: false, message: 'Invalid credentials. Please sign up first.' };
    }
  }
}
