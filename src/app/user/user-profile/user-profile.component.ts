import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {AuthenticationService} from "../../service/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../service/user.service";
import {NotificationType} from "../../enum/notification-type.enum";
import {HttpErrorResponse, HttpEvent, HttpEventType} from "@angular/common/http";
import {NotificationService} from "../../service/notification.service";
import {FileUploadStatus} from "../../model/file-upload.status";
import {ModalService} from "../../service/modal.service";
import {RoleService} from "../../service/role.service";
import {SubSink} from "subsink";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  user = new User();
  loggedInUser = new User();
  editUser = new User();
  private currentUsername = '';
  profilePicture!: File;
  private subscriptions = new SubSink();
  public fileStatus = new FileUploadStatus();
  usernameParam = '';
  isloggedInUser = false;

  constructor(private authService: AuthenticationService,
              public roleService: RoleService,
              private userService: UserService,
              private notificationService: NotificationService,
              private modalService: ModalService,
              private route: ActivatedRoute,
              private router: Router) {
    this.subscriptions.add(
      this.route.params.subscribe(
        params => this.usernameParam = params.username
      )
    );
  }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getUserFromLocalStorage();
    if (this.usernameParam) {
      this.subscriptions.add(
        this.userService.getUserByUsername(this.usernameParam).subscribe(
          (response: User) => {
            this.user = response
            this.isloggedInUser = this.loggedInUser.username === response.username;
          },
          (error: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, error.error.message);
          }
        )
      );
    } else {
      this.isloggedInUser = true;
      this.user = this.loggedInUser;
    }
  }

  /**
   * Binded click action on visible button to trigger the hidden submit button in hidden form
   */
  onUpdateProfilePicture(): void {
    UserProfileComponent.clickButton('profile-picture-input');
  }

  /**
   * Handles the profile image change to send the new image in the front end
   * @param event HttpEvent: event triggered when uploading profile picture
   * @param imageId string: tag's id of image preview
   */
  onProfileImageChange(event: any, imageId: string): void {
    const output = document.getElementById(imageId);
    this.profilePicture = event.target.files[0];
    // @ts-ignore
    output.src = URL.createObjectURL(this.profilePicture);
  }

  /**
   * Handles user's profile picture update
   */
  onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profilePicture);
    this.subscriptions.add(
      this.userService.updateProfileImage(formData).subscribe(
        (event: HttpEvent<any>) => {
          this.reportUploadProgress(event);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  /**
   * Load user's info to send it in the form and opens the modal
   * @param editUser
   */
  onEditUser(editUser: User) {
    this.editUser = editUser;
    this.currentUsername = editUser.username;
    UserProfileComponent.clickButton('openEditModal');
  }

  /**
   * Update user's info in the database
   */
  updateUser(): void {
    // @ts-ignore
    const formData = this.userService.createUserFormData(this.currentUsername, this.editUser, this.profilePicture);
    this.subscriptions.add(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.onCloseModals();
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} updated successfully`);
          this.router.navigateByUrl('user/profile/' + response.username).then();
          // this.getUsers(false);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  /**
   * Generates a progress status and percentage when uploading user's profile picture
   * @param event HttpEvent: event generated when uploading profile picture
   * @private
   */
  private reportUploadProgress(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        // @ts-ignore
        this.fileStatus.percentage = Math.round(100* event.loaded / event.total);
        this.fileStatus.status = 'progress';
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
          this.authService.addUserToLocalStorage(event.body);
          this.sendNotification(NotificationType.SUCCESS, `${event.body.firstName}'s profile picture updated successfully!`);
          this.fileStatus.status = 'complete';
          break;
        } else {
          this.sendNotification(NotificationType.ERROR, `Unable to upload image. Please try again`);
          break;
        }
      default:
        `Finished all processes`;
        break;
    }
  }

  /**
   * Aims the button in hidden profile image form to click it programmatically
   * @param buttonId string: button id
   * @private
   */
  private static clickButton(buttonId: string): void {
    // @ts-ignore
    document.getElementById(buttonId).click();
  }

  /**
   * Log user out
   */
  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('login').then();
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

  /**
   * Calls modal service to open a modal
   * @param modalName string: name of the modal we want to open
   */
  onOpenModal(modalName: string): void {
    this.modalService.openModal(modalName);
  }

  /**
   * Calls modal service to close all opened modals
   */
  onCloseModals(): void {
    this.modalService.closeModals();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
