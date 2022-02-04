import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {NotificationService} from "../service/notification.service";
import {User} from "../model/user";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {NotificationType} from "../enum/notification-type.enum";
import {HeaderType} from "../enum/header-type.enum";
import {SubSink} from "subsink";
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  showLoading = false;
  private subscriptions = new SubSink();

  constructor(private router: Router,
              private authService: AuthenticationService,
              public appComp: AppComponent,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management').then();
    } else {
      this.router.navigateByUrl('/login').then();
    }
  }

  /**
   * Fired when user clicks on login button
   * @param user
   */
  onLogin(user: User): void {
    this.showLoading = true;
    this.subscriptions.add(
      this.authService.login(user).subscribe(
        (response: HttpResponse<User>) => {
          const token = response.headers.get(HeaderType.JWT_TOKEN);
          if (token != null) {
            this.authService.saveToken(token);
          }
          if (response.body) {
            this.appComp.changeUser(response.body);
            this.authService.addUserToLocalStorage(response.body)
          }
          this.router.navigateByUrl('/user/profile').then();
          this.sendNotification(NotificationType.SUCCESS, `Welcome back ${response.body?.firstName}!`);
          this.showLoading = false;
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  /**
   * If user forgot his password, inform him to contact an admin
   */
  forgotPasswordNotification() {
    this.sendNotification(NotificationType.INFO, 'Please, contact an admin to reset your password');
  }

  /**
   * Calls notificationService to send notification while logging in
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
