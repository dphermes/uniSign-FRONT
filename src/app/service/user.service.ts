import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Fetch all users service (http call)
   * @return User[]: list of all users or HttpErrorResponse
   */
  public getUsers(): Observable<User[] | HttpErrorResponse> {
    return this.http.get<User[]>(`${this.host}/user/all`);
  }

  /**
   * Add a user service (http call)
   * @return User: added user or HttpErrorResponse
   */
  public addUser(formData: FormData): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(`${this.host}/user/add`, formData);
  }

  /**
   * Update a user service (http call)
   * @return User: updated user or HttpErrorResponse
   */
  public updateUser(formData: FormData): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(`${this.host}/user/update`, formData);
  }

  /**
   * Reset user's password service (http call)
   * @return User: updated user or HttpErrorResponse
   */
  public resetPassword(email: string): Observable<any | HttpErrorResponse> {
    return this.http.get(`${this.host}/user/reset-password/${email}`);
  }

  /**
   * Update user's Profile Image service (http call)
   * @return User: updated user or HttpErrorResponse
   */
  public updateProfileImage(formData: FormData): Observable<HttpEvent<User> | HttpErrorResponse> {
    return this.http.post<User>(`${this.host}/user/update-profile-image`, formData,
      {
        reportProgress: true,
        observe: 'events'
      });
  }
}
