import { Component, OnInit } from '@angular/core';

import {FormControl, Validators} from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { UserService } from '../auth/user.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private _http: HttpClient, 
    private rotuer: Router, 
    private userService: UserService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
  }
  
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl("", [Validators.required]);
  hide = true;

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  formLogin(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      })
    }
    const response = this.userService.login(this.email.value, this.password.value)
    response.subscribe(
      res => {
        if(res) {
          this.rotuer.navigateByUrl("/dashboard")
          console.log("good credentials")
        } else {
          console.log("formLogin()   " + res)
          this.openSnackBar("wrong credentials", "try again")
        }
      },
      err => {
        console.log("login error", err)
        const status: Number = err.status
        let errorMessage: string
        switch(status){
          case 401:
            errorMessage = 'Wrong credential'
            break
          default:
            errorMessage = 'Server error'
        }
        this.openSnackBar(errorMessage, "try leater")
      }
    )
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}