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
  private selectedUser = new User();
  profilePicture!: File;

  constructor(private router: Router,
              private userService: UserService,
              private authService: AuthenticationService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getUsers(false);
  }

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
    )
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
    )
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
    // @ts-ignore
    const formData = this.userService.createUserFormData(null, userForm.value, this.profilePicture);
    this.subscriptions.push(
      this.userService.addUser(formData).subscribe(
        (response: User) => {
          // @ts-ignore
          this.profilePicture = null;
          userForm.reset();
          this.cancelAddUser();
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} added successfully`);
          this.getUsers(false);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    )
  }

  onDeleteUser(userToDelete: User) {
    this.subscriptions.push(
      this.userService.deleteUser(userToDelete.id).subscribe(
        (response: CustomHttpResponse) => {
          this.onCancelDelete(userToDelete);
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getUsers(false);
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

  onCancelDelete(selectedUser: User) {
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
