import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {NotificationService} from "../service/notification.service";
import {User} from "../model/user";
import {Subscription} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {NotificationType} from "../enum/notification-type.enum";
import {HeaderType} from "../enum/header-type.enum";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  showLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router,
              private authService: AuthenticationService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  /**
   * Fired when user clicks on login button
   * @param user
   */
  onLogin(user: User): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authService.login(user).subscribe(
        (response: HttpResponse<User>) => {
          const token = response.headers.get(HeaderType.JWT_TOKEN);
          if (token != null) {
            this.authService.saveToken(token);
          }
          if (response.body) {
            this.authService.addUserToLocalStorage(response.body)
          }
          this.router.navigateByUrl('/user/management');
          this.sendErrorNotification(NotificationType.SUCCESS, `Welcome back ${response.body?.firstName}!`);
          this.showLoading = false;
        },
        (error: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, error.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  private sendErrorNotification(notificationType: NotificationType, message: string): void {
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
