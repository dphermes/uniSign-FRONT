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
import {Agency} from "../../model/agency";
import {AgencyService} from "../../service/agency.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  userForm: FormGroup;
  user = new User();
  loggedInUser = new User();
  editUser = new User();
  private currentUsername = '';
  profilePicture!: File;
  private subscriptions = new SubSink();
  public fileStatus = new FileUploadStatus();
  usernameParam = '';
  isloggedInUser = false;
  agencies: Agency[] = [];
  selectedAgency = new Agency();

  constructor(private formBuilder: FormBuilder,
              private authService: AuthenticationService,
              public roleService: RoleService,
              private userService: UserService,
              private agencyService: AgencyService,
              private notificationService: NotificationService,
              private modalService: ModalService,
              private route: ActivatedRoute,
              private router: Router) {
    this.userForm = formBuilder.group({
      firstName: '',
      lastName: '',
      username: '',
      profileImage: '',
      email: '',
      agency: new Agency(),
      role: '',
      isActive: true,
      isNotLocked: true
    })
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
            console.log('HERE');
            console.log(this.user);
            this.initUserForm()
          },
          (error: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, error.error.message);
          }
        )
      );
    } else {
      this.isloggedInUser = true;
      this.user = this.loggedInUser;
      this.initUserForm()
      console.log('THERE');
      console.log(this.user);
    }
    this.getAgencies();
  }

  initUserForm(): void {
    console.log('User from init');
    console.log(this.user);
    this.userForm.get('agency')?.setValue(this.user.agency);
    console.log(this.selectedAgency);
    this.userForm = this.formBuilder.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      username: [this.user.username, Validators.required],
      profileImage: [this.profilePicture],
      email: [this.user.email, Validators.pattern('^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$')],
      agency: [this.user.agency],
      role: [this.user.role],
      isActive: [this.user.active],
      isNotLocked: [this.user.notLocked]
    });
  }

  public getAgencies() {
    this.subscriptions.add(
      this.agencyService.getAgencies().subscribe(
        (response: Agency[]) => {
          this.agencies = response;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }

      )
    );
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
    if (this.isloggedInUser) {
      const outputAppComp = document.getElementById('menuProfilePicture');
      // @ts-ignore
      outputAppComp.src = URL.createObjectURL(this.profilePicture);
    }
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
    console.log(this.editUser);
    this.currentUsername = editUser.username;
    UserProfileComponent.clickButton('openEditModal');
  }

  /**
   * Update user's info in the database
   */
  onSaveUser(user: User): void {
    user.firstName = this.userForm.get('firstName')?.value;
    user.lastName = this.userForm.get('lastName')?.value;
    user.username = this.userForm.get('username')?.value;
    user.profileImageUrl = this.userForm.get('profileImage')?.value;
    user.email = this.userForm.get('email')?.value;
    user.agency = this.userForm.get('agency')?.value,
    user.role = this.userForm.get('role')?.value;
    user.active = this.userForm.get('isActive')?.value;
    user.notLocked = this.userForm.get('isNotLocked')?.value;

    console.log('user in save method');
    console.log(user);

    this.subscriptions.add(
        this.userService.updateNewWayUser(user).subscribe(
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
          if (this.isloggedInUser) {
            this.authService.addUserToLocalStorage(event.body);
          }
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
