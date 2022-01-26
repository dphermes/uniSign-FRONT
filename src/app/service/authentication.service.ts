import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Observable} from "rxjs";
import {User} from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private host = environment.apiUrl;
  private token = '';
  private loggedInUsername = '';
  private jwtHelper = new JwtHelperService();

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
  public register(user: User): Observable<HttpResponse<User | HttpErrorResponse>> {
    return this.http.post<User | HttpErrorResponse>(`${this.host}/user/register`, user, {observe: 'response'});
  }

  /**
   * Checks if user is logged in
   */
  public isUserLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== ''
        && (this.jwtHelper.decodeToken(this.token).sub != null || '')
        && !this.jwtHelper.isTokenExpired(this.token)) {
        this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
        return true;
    } else {
      this.logout();
      return false;
    }
  }

  /**
   * Logout User and clean local storage
   */
  public logout(): void {
    this.token = '';
    this.loggedInUsername = '';
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  /**
   * Save Jwt Token to local storage
   */
  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  /**
   * Save User to local storage
   */
  public addUserToLocalStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Load Token from local storage
   */
  public loadToken(): void {
    this.token = localStorage.getItem('token') || '';
  }

  /**
   * get Token
   */
  public getToken(): string {
    return this.token;
  }

  /**
   * Get User from local storage
   */
  public getUserFromLocalStorage(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

}
