import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdminService {
  private isAdmin: boolean = false

  constructor(private router: Router, private userservice: UserService) { }

  canActivate(
    nest: ActivatedRouteSnapshot,
    state: RouterStateSnapshot ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let result =  this.checkAdmin(state.url)
      return result
  }

  private checkAdmin(requestdeUrl: string): boolean | Observable<boolean>{
    if (this.isAdmin)
      return true
    this.userservice.isAdmin().subscribe(
      res => {
        this.isAdmin = true
        this.router.navigateByUrl(requestdeUrl)
      },
      error => { 
        switch (error.status) {
          case 401:
            console.log("unautorized")
            this.isAdmin = false
            this.router.navigateByUrl('/login')
            break;
          default:
            console.log("server error: " + error.status + " " + error.statusText)
            break;
        }
      }
    )
    return this.isAdmin
  }
}
