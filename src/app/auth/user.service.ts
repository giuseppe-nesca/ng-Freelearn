import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators'
import { User } from '../model/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly _loginUrl: string = "http://localhost:8080/login"
  readonly _userInfoUrl: string = "http://localhost:8080/userinfo"

  // private user: User = new User(-1, 'John', 'Doe', 'prova@email.it', 'utente')
  private user$ = new BehaviorSubject<User>(new User(-1, 'John', 'Doe', 'prova@email.it', 'utente'))

  constructor(private httpClient: HttpClient) { }

  getUser() {
    this.httpClient.get(
      this._userInfoUrl,
      {
        observe: 'response',
        withCredentials: true,
      }
    ).pipe(
      map(
        res => {
          return res.body
        }
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
      { observe: 'response', withCredentials: true }).pipe(
        map(res => res.status)
      )
  }

  public login(email: string, password: string) {
    console.log("login called")
    let urlEncodedRequest = "email="+(email)+"&"+"password="+(password)
    return this.httpClient.post(
      this._loginUrl,
      urlEncodedRequest,
      {
        observe: 'response',
        headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      }),
      withCredentials: true,
    }).pipe(
      map(
        res => {
          return true
        }
      )
    )
  }
}
