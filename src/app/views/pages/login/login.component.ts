import { Component } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder,FormControl,FormGroup } from '@angular/forms';
import {LoginServiceService} from '../../../Services/login-service/login-service.service'
import { Route, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [CommonModule,ReactiveFormsModule,ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle]
})
export class LoginComponent {

  loginForm !: FormGroup

  constructor(private fb : FormBuilder,private Service : LoginServiceService,private route : Router) { 
    this.loginForm = this.fb.group({
      MobileNumber : ['',Validators.required],
      Password     : ['',Validators.required]
    })
  }

  submit(){
    if(this.loginForm.invalid){
      return
    }
 
    this.Service.login(this.loginForm.value).subscribe(response=>{     
      sessionStorage.setItem('loginDetails',JSON.stringify(response.data))
      this.Service.toggleAuthenticator()
      this.Service.isAuthenticatedUser()
      this.route.navigate(['/dashboard'])
    },(err)=>{
      this.Service.isAuthenticatedUser()
      console.log("Something went wrong")
    })

    console.log(this.loginForm)
  }



}
