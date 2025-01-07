import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenmanagementService {
  private readonly TOKEN_KEY = 'auth_token';
  constructor() { }
  // Save token
  saveToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token); // Use sessionStorage or localStorage as needed
  }

  // Get token
  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  // Remove token
  removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }
}
