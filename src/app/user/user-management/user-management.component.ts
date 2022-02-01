import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {User} from "../../model/user";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {NotificationService} from "../../service/notification.service";
import {NotificationType} from "../../enum/notification-type.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {CustomHttpResponse} from "../../model/custom-http-response";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit, OnDestroy {

  public users: User[] = [];
  showLoading = false;
  private subscriptions: Subscription[] = [];
  profilePicture!: File;
  private openedModals: string[] = [];

  constructor(private router: Router,
              private userService: UserService,
              private authService: AuthenticationService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getUsers(false);
  }

  /**
   * Fetch the whole list of users
   * @param showNotification boolean: if you want to show a notification with the amount of retrieved user
   */
  public getUsers(showNotification: boolean) {
    this.showLoading = true;
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          console.log(response);
          this.userService.addUsersToLocalStorage(response);
          this.users = response;
          this.showLoading = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  /**
   * Search users by fist name, last name, username, email or userId in the list of users
   * @param searchTerm string: fist name, last name, username, email or userId to search
   */
  public searchUsers(searchTerm: string): void {
    console.log(searchTerm);
    const results: User[] = [];
    for (const user of this.userService.getUsersFromLocalStorage()) {
      // Put everything to lowercase because indexOf is case sensitive
      if (user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          user.userId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        results.push(user);
      }
    }
    this.users = results;
    if (results.length === 0 || !searchTerm) {
      this.users = this.userService.getUsersFromLocalStorage();
    }
  }

  public activateDeactivateUser(userToUnlock: User) {
    const formData = this.userService.createUserFormData(userToUnlock.username, userToUnlock, this.profilePicture);
    console.log(formData);
    if (userToUnlock.active) {
      formData.set('set', 'false');
    } else {
      formData.set('set', 'true');
    }
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} updated successfully!`);
          this.getUsers(false);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  public lockUnlockUser(userToUnlock: User) {
    const formData = this.userService.createUserFormData(userToUnlock.username, userToUnlock, this.profilePicture);
    if (userToUnlock.notLocked) {
      formData.set('isNotLocked', 'false');
    } else {
      formData.set('isNotLocked', 'true');
    }
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} updated successfully!`);
          this.getUsers(false);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  private createUpdateFormData(user: User): FormData {
    const formData = new FormData();
    formData.append('currentUsername', user.username);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.role);
    return formData;
  }

  /**
   * Add a new user to the database
   * @param userForm: Form with new user's information
   */
  onAddNewUser(userForm: NgForm): void {
    // @ts-ignore
    const formData = this.userService.createUserFormData(null, userForm.value, this.profilePicture);
    this.subscriptions.push(
      this.userService.addUser(formData).subscribe(
        (response: User) => {
          // @ts-ignore
          this.profilePicture = null;
          userForm.reset();
          this.onCloseModals();
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} added successfully`);
          this.getUsers(false);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  /**
   * Delete a user from the database
   * @param userToDelete User: User to delete
   */
  onDeleteUser(userToDelete: User): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.userService.deleteUser(userToDelete.id).subscribe(
        (response: CustomHttpResponse) => {
          this.onCloseModals();
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.showLoading = false;
          this.getUsers(false);
        },
        (error: HttpErrorResponse) => {
          this.showLoading = false;
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  /**
   * Reset a user's password and send email with new password
   * @param emailAddress string: user's email address to send email
   * @param userId string: userId to close reset password modal
   */
  onResetPassword(emailAddress: string, userId: string): void {
    this.showLoading = true;
    const loggedInUser = this.authService.getUserFromLocalStorage();
    const loggedInUserEmail = loggedInUser.email;
    this.subscriptions.push(
      this.userService.resetPassword(emailAddress).subscribe(
        (response: CustomHttpResponse) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.onCloseModals();
          this.showLoading = false;
          if (loggedInUserEmail == emailAddress) {
            this.authService.logout();
            this.router.navigateByUrl('login');
          } else {
            this.getUsers(false);
          }
        },
        (error: HttpErrorResponse) => {
          this.showLoading = false;
          this.sendNotification(NotificationType.WARNING, error.error.message);
        }
      )
    );
  }

  onProfileImageChange(event: any): void {
    const output = document.getElementById('profilePicturePreview');
    this.profilePicture = event.target.files[0];
    // @ts-ignore
    output.src = URL.createObjectURL(this.profilePicture);
  }

  /**
   * Opens a modal in template and stores it in an array to close later
   * @param modalName string: name of the modal we want to open
   */
  onOpenModal(modalName: string): void {
    this.onCloseModals();
    this.openedModals.push(modalName);
    if (modalName.includes('userDropDown')) {
      // @ts-ignore
      document.getElementById('modalOverlay').style.display='block';
      this.openedModals.push('modalOverlay');
    }
    // @ts-ignore
    document.getElementById(modalName).style.display='block';
  }

  /**
   * Closes all modals opened and stored in openedModals array
   */
  onCloseModals(): void {
    for (let modal of this.openedModals) {
      // @ts-ignore
      document.getElementById(modal).style.display='none';
    }
    this.openedModals = [];
  }

  /**
   * Calls Notification Service to notify in this component
   * @param notificationType NotificationType: notification type (e.g: ERROR, SUCCESS...)
   * @param message string: Message to show in the notification
   * @private
   */
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
