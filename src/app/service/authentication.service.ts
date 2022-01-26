import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Login http service call
   * @param user User: Whole user object
   */
  public login(user: User): Observable<HttpResponse<any> | HttpErrorResponse> {
    // Observe the whole response instead of the body to fetch the headers with the Jwt Token
    return this.http.post<HttpResponse<any> | HttpErrorResponse>(`${this.host}/user/login`, user, {observe: 'response'});
  }

  /**
   * Register http service call
   * @param user User: Whole user object
   */
  public register(user: User): Observable<User | HttpErrorResponse> {
    // Observe the whole response instead of the body to fetch the headers with the Jwt Token
    return this.http.post<User | HttpErrorResponse>(`${this.host}/user/register`, user, {observe: 'response'});
  }


}
