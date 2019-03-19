import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private userservice: UserService) {}

  canActivate(
    nest: ActivatedRouteSnapshot,
    state: RouterStateSnapshot ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.checkLogin()
  }

  private checkLogin(){
    var isLogged: boolean = false
    this.userservice.isLogged().subscribe(
      res => {
        console.log('reslog ok ',res)
        isLogged = true
      },
      error => { 
        switch (error.status) {
          case 200: 
          console.log("autorized")
            isLogged = true
            break;
          case 401:
            console.log("unautorized")
            this.router.navigateByUrl('/login')
            break;
          default:
            console.log("server error: " + error.status + " " + error.statusText)
            //TODO
            break;
        }
      }
    )
    return isLogged
  }
}
