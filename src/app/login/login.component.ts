import { Component, OnInit } from '@angular/core';

import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { UserService } from '../auth/user.service';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private rotuer: Router, 
    private userService: UserService,
    private errorService: ErrorService
    ) { }

  ngOnInit() {
  }
  
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hide = true;

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' : '';
  }

  formLogin(){
    const response = this.userService.login(this.email.value, this.password.value)
    response.subscribe(
      res => { if(res) { this.rotuer.navigateByUrl("/dashboard") }},
      err => {
        const status: Number = err.status
        switch(status){
          case 401:
            this.errorService.showErrorMessage("Wrong credentials", "try again")
            break
          default:
            this.errorService.showErrorMessage("Server Error", "try again")
        }
      }
    )
  }
}