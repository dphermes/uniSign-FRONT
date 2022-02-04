import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {NotificationService} from "../service/notification.service";
import {HttpErrorResponse} from "@angular/common/http";
import {User} from "../model/user";
import {NotificationType} from "../enum/notification-type.enum";
import {SubSink} from "subsink";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  showLoading = false;
  emailExists = false;
  usernameExists = false;
  private subscriptions = new SubSink();

  constructor(private router: Router,
              private authService: AuthenticationService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management').then();
    }
  }

  /**
   * Register a new user if not logged in
   * @param user
   */
  onRegister(user: User) {
    this.emailExists = false;
    this.usernameExists = false;
    this.showLoading = true;
    this.subscriptions.add(
      this.authService.register(user).subscribe(
        (response: User) => {
          this.showLoading = false;
          this.router.navigateByUrl('/login').then();
          this.sendNotification(NotificationType.SUCCESS, `Welcome ${response.firstName}! Check your emails for password.`);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
          if (error.error.message == 'This username already exists') {
            this.usernameExists = true;
          }
          if (error.error.message == 'This email already exists') {
            this.emailExists = true;
          }
          this.showLoading = false;
        }
      )
    );
  }

  /**
   * Calls notificationService to send notification while registering new user
   * @param notificationType NotificationType: type of notification (SUCCESS, ERROR, ...)
   * @param message string: message to show to user
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
    this.subscriptions.unsubscribe();
  }

}
