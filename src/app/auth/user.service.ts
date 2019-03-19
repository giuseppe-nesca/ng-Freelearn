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
      { observe: 'response' }).pipe(
        map(res => res.status)
      )
  }

  //TODO
  public login(email: string, password: string): Observable<string> {
    console.log("login called")
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      }),
      withCredentials: true
    }
    let urlEncodedRequest = "email="+(email)+"&"+"password="+(password)
    let resultString: string = "false"
    return this.httpClient.post<string>(this._loginUrl, urlEncodedRequest, httpOptions)
  }
}
