import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  baseUrl = environment.apiUrl + 'login';

  private isAuthenticated = false;
  constructor(private http: HttpClient) { }

  login(details: any): Observable<any> {
    return this.http.post(this.baseUrl, details)
  }

  toggleAuthenticator() {
    if (this.isAuthenticated) {
      this.isAuthenticated = false
    } else {
      this.isAuthenticated = true
    }
  }


  isAuthenticatedUser(): boolean {
    let getsession = sessionStorage.getItem('loginDetails')
    getsession = JSON.parse(getsession!)
  //  console.log(getsession);

    if (getsession) {
      this.isAuthenticated = true
    }
    return this.isAuthenticated;
  }
}
