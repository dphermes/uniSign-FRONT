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

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit, OnDestroy {

  users: User[] = [];
  showLoading = false;
  private subscriptions: Subscription[] = [];
  private selectedUser = new User();
  profilePicture!: File;

  constructor(private router: Router,
              private userService: UserService,
              private authService: AuthenticationService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.showLoading = true;
    this.getUsers(false);
  }

  public getUsers(showNotification: boolean) {
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
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

  public activateDeactivateUser(userToUnlock: User) {
    const formData = this.createUpdateFormData(userToUnlock);
    formData.append('isNotLocked', userToUnlock.notLocked.toString());
    if (userToUnlock.active) {
      userToUnlock.active = false;
      formData.append('isActive', 'false');
    } else {
      userToUnlock.active = true;
      formData.append('isActive', 'true');
    }
    this.userService.updateUser(formData).subscribe(
      (response: User) => {
        this.authService.getUserFromLocalStorage();
        this.sendNotification(NotificationType.SUCCESS, `${response.firstName} is active`);
      },
      (error: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, error.error.message);
        this.showLoading = false;
      }
    );
  }

  public lockUnlockUser(userToUnlock: User) {
    const formData = this.createUpdateFormData(userToUnlock);
    formData.append('isActive', userToUnlock.active.toString());
    if (userToUnlock.notLocked) {
      userToUnlock.notLocked = false;
      formData.append('isNotLocked', 'false');
    } else {
      userToUnlock.notLocked = true;
      formData.append('isNotLocked', 'true');
    }
    this.userService.updateUser(formData).subscribe(
      (response: User) => {
        this.sendNotification(NotificationType.SUCCESS, `${response.firstName} is unlocked`);
      },
      (error: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, error.error.message);
        this.showLoading = false;
      }
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

  onAddNewUser(userForm: NgForm): void {
    const formData = this.userService.createUserFormData('', userForm.value, this.profilePicture);
    this.subscriptions.push(
      this.userService.addUser(formData).subscribe(
        (response: User) => {
          // @ts-ignore
          this.profilePicture = null;
          userForm.reset();
          this.cancelAddUser();
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} added successfully`);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    )
  }

  deleteUser(userToDelete: User) {
    this.subscriptions.push(
      this.userService.deleteUser(userToDelete.id).subscribe(
        (response) => {
          this.sendNotification(NotificationType.SUCCESS, `${response.message}`);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    )
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  public onSelectUserDropdown(selectedUser: User): void {
    this.selectedUser = selectedUser;
    // @ts-ignore
    document.getElementById('userDropDown' + selectedUser.id).style.display='block';
    // @ts-ignore
    document.getElementById('dropdownOverlay' + selectedUser.id).style.display='block';
  }

  public closeDropdownOverlay(selectedUser: User) {
    // @ts-ignore
    document.getElementById('userDropDown' + selectedUser.id).style.display='none';
    // @ts-ignore
    document.getElementById('dropdownOverlay' + selectedUser.id).style.display='none';
  }

  openUserDeleteModal(selectedUser: User): void {
    this.selectedUser = selectedUser;
    // @ts-ignore
    document.getElementById('userDropDown' + selectedUser.id).style.display='none';
    // @ts-ignore
    document.getElementById('dropdownOverlay' + selectedUser.id).style.display='none';
    // @ts-ignore
    document.getElementById('userDeleteModal' + selectedUser.id).style.display='block';
  }

  cancelDelete(selectedUser: User) {
    // @ts-ignore
    document.getElementById('userDeleteModal' + selectedUser.id).style.display='none';
  }

  onOpenAddUserModal() {
    // @ts-ignore
    document.getElementById('userAddModal').style.display='block';
  }

  cancelAddUser(): void {
    // @ts-ignore
    document.getElementById('userAddModal').style.display='none';
  }

  onProfileImageChange(event: any): void {
    const output = document.getElementById('profilePicturePreview');
    this.profilePicture = event.target.files[0];
    // @ts-ignore
    output.src = URL.createObjectURL(this.profilePicture);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
