import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly _loginUrl: string = "http://localhost:8080/login"

  constructor(private httpClient: HttpClient) { }

  isLogged() {
    return this.httpClient.get(
      this._loginUrl,
      { observe: 'response' })
  }
}
