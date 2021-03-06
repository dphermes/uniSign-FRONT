import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {CustomHttpResponse} from "../model/custom-http-response";

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
  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/user/all`);
  }

  /**
   * Fetch a user search by username
   * @param username string: user's username to fetch
   */
  public getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.host}/user/find/` + username);
  }

  /**
   * Add a user service (http call)
   * @return User: added user or HttpErrorResponse
   */
  public addUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/add`, formData);
  }

  /**
   * Update a user service (http call)
   * @return User: updated user or HttpErrorResponse
   */
  public updateUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/update`, formData);
  }

  /**
   * Update a user service (http call)
   * @return User: updated user or HttpErrorResponse
   */
  public updateNewWayUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/user/update`, user);
  }

  /**
   * Reset user's password service (http call)
   * @return User: updated user or HttpErrorResponse
   */
  public resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/user/reset-password/${email}`);
  }

  /**
   * Update user's Profile Image service (http call)
   * @return User: updated user or HttpErrorResponse
   */
  public updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${this.host}/user/update-profile-image`, formData,
      {
        reportProgress: true,
        observe: 'events'
      });
  }

  /**
   * Delete user service (http call)
   */
  public deleteUser(username: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/user/delete/${username}`);
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
    // @ts-ignore
    formData.append('agencyLabel', user.agency.label);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.notLocked));
    return formData;
  }
}
