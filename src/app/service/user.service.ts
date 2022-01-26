import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import { User } from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

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

  /**
   * Delete user service (http call)
   */
  public deleteUser(userId: number): Observable<any | HttpErrorResponse> {
    return this.http.delete<any>(`${this.host}/user/delete/${userId}`);
  }

  /**
   * Add users to the Local Storage
   * @param users User[]: list of users
   */
  public addUsersToLocalStorage(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  /**
   * Get users from the Local Storage
   */
  public getUsersFromLocalStorage(): User[] {
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users') || '{}');
    }
    return [];
  }

  /**
   * User formData to send Data to the backend
   * @param loggedInUsername string: currently logged-in user's username
   * @param user User: Whole user object
   * @param profileImage File: user's profile image
   * @return FormData: user's form data
   */
  public createUserFormData(loggedInUsername: string, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.isActive));
    formData.append('isNotLocked', JSON.stringify(user.isNotLocked));
    return formData;
  }
}
