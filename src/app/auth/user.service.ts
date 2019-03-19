import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly _loginUrl: string = "http://localhost:8080/login"

  constructor(private httpClient: HttpClient) { }

  isLogged() {
    return this.httpClient.get(
      this._loginUrl,
      { observe: 'response', withCredentials: true }).pipe(
        map(res => res.status)
      )
  }

  //TODO
  public login(email: string, password: string) {
    console.log("login called")
    let urlEncodedRequest = "email="+(email)+"&"+"password="+(password)
    let resultString: string = "false"
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
