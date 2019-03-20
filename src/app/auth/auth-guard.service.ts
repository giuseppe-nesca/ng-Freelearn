import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isLogged: boolean = false

  constructor(private router: Router, private userservice: UserService) {}

  canActivate(
    nest: ActivatedRouteSnapshot,
    state: RouterStateSnapshot ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log(`first value = ${this.isLogged}`)
      let result =  this.checkLogin(state.url)
      console.log(`returned : ${result}`, `second value = ${this.isLogged}`)
      return result
  }

  private checkLogin(requestdeUrl: string): boolean | Observable<boolean>{
    if (this.isLogged)
      return true
    this.userservice.isLogged().subscribe(
      res => {
        console.log('reslog ok ',res)
        this.isLogged = true
        this.router.navigateByUrl(requestdeUrl)
      },
      error => { 
        switch (error.status) {
          case 401:
            console.log("unautorized")
            this.isLogged = false
            this.router.navigateByUrl('/login')
            break;
          default:
            console.log("server error: " + error.status + " " + error.statusText)
            //TODO
            break;
        }
      }
    )
    return this.isLogged
  }
}
