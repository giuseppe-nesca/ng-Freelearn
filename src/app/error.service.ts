import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private snackBar: MatSnackBar) {}

  showErrorMessage(message: string, secondMessage: string = "ok") {
    this.openSnackBar(message, secondMessage)
  }

  openSnackBar(message: string, action: string, duration: number = 3000) {
    this.snackBar.open(message, action, { duration: duration })
  }

  authErrorMessage(){
    this.openSnackBar("You're not authenticated", "login", 6000)
  }
}
