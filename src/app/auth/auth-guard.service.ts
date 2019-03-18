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
    var isLogged: boolean = true
    this.userservice.isLogged().subscribe(
      res => {
        console.log('reslog ' + res)
      },
      err => {
        console.log('errlog ' + err)
      }
    )
    return isLogged
  }
}
