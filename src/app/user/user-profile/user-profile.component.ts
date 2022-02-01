import { Component, OnInit } from '@angular/core';
import {User} from "../../model/user";
import {AuthenticationService} from "../../service/authentication.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {UserService} from "../../service/user.service";
import {NotificationType} from "../../enum/notification-type.enum";
import {HttpErrorResponse, HttpEvent} from "@angular/common/http";
import {NotificationService} from "../../service/notification.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user = new User();
  profilePicture!: File;
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthenticationService,
              private userService: UserService,
              private notificationService: NotificationService,
              private router: Router) { }

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();
  }

  updateProfilePicture(): void {
    this.clickButton('profile-picture-input');
  }

  onProfileImageChange(event: any): void {
    const output = document.getElementById('profilePicturePreview');
    this.profilePicture = event.target.files[0];
    // @ts-ignore
    output.src = URL.createObjectURL(this.profilePicture);
  }

  onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profilePicture);
    this.subscriptions.push(
      this.userService.updateProfileImage(formData).subscribe(
        (event: HttpEvent<any>) => {
          this.sendNotification(NotificationType.SUCCESS, `Profile picture updated successfully!`);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  private clickButton(buttonId: string): void {
    // @ts-ignore
    document.getElementById(buttonId).click();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('login');
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
}
