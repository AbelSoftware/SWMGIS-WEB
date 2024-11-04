import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {


  private isAuthenticated = false;

  constructor(private http : HttpClient) { }

  login(details:any):Observable<any>{
    return this.http.post('http://172.174.239.107:3000/api/login',details)
  }

  toggleAuthenticator(){
    if(this.isAuthenticated){
      this.isAuthenticated = false
    }else{
      this.isAuthenticated = true
    }
  }


  isAuthenticatedUser(): boolean {

    let getsession = sessionStorage.getItem('loginDetails')
    
    
    getsession = JSON.parse(getsession!)
    console.log(getsession);

    if(getsession){
      this.isAuthenticated = true
    }
    
    
    return this.isAuthenticated;
  }
}
