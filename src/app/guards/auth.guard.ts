import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Router } from '@angular/router';
import { LoginServiceService } from '../Services/login-service/login-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {

  constructor(private router: Router, private authService: LoginServiceService) {}

  canActivate(): boolean | Observable<boolean> {
    return this.checkAuth();
  }

  canActivateChild(): boolean | Observable<boolean> {
    return this.checkAuth();
  }

  canDeactivate(component: unknown): boolean | Observable<boolean> {
    // Example: if the component has unsaved changes, confirm before navigating away
    // You would typically check for unsaved changes in the component here
    // return window.confirm('You have unsaved changes. Do you really want to leave?');
    return true;
  }

  canLoad(): boolean | Observable<boolean> {
    return this.checkAuth();
  }

  private checkAuth(): boolean {
    if (this.authService.isAuthenticatedUser()) {
      
      return true;
    } else {
      // Redirect to the login page if the user is not authenticated
      this.router.navigate(['/login']);
      return false;
    }
  }
}
