import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators'
import { User } from '../model/user';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly _loginUrl: string = "http://localhost:8080/login"
  readonly _userInfoUrl: string = "http://localhost:8080/userinfo"
  readonly _userLogout: string = "http://localhost:8080/logout"

  private user$ = new BehaviorSubject<User>(new User(-1, 'John', 'Doe', 'prova@email.it', 'utente'))

  constructor(private httpClient: HttpClient, private router: Router) { }

  getUser() {
    this.httpClient.get(
      this._userInfoUrl,
      {
        observe: 'response',
        withCredentials: true,
      }
    ).pipe(
      map(
        res => res.body
      )).subscribe(
        (json) => {
          // @ts-ignore
          this.user$.next(new User(json.id, json.name, json.surname, json.email, json.role))
        },
        err => {
          // TODO
        }
      )
    return this.user$.asObservable()
  }

  isLogged() {
    return this.httpClient.get(
        this._loginUrl,
        { observe: 'response', withCredentials: true }
      ).pipe( map(res => res.status) )
  }

  public login(email: string, password: string) {
    let urlEncodedRequest = "email="+(email)+"&"+"password="+(password)
    return this.httpClient.post(
      this._loginUrl,
      urlEncodedRequest,
      {
        observe: 'response',
        headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'}),
        withCredentials: true,
      }
    ).pipe( map(res => true) )
  }

  public logout(){
    this.httpClient.get(
      this._userLogout,
      {
        headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'}),
        withCredentials: true
      }
    ).subscribe()
    this.router.navigateByUrl("/login")
  }
}
