import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {NotificationService} from "../service/notification.service";
import {HttpErrorResponse} from "@angular/common/http";
import {User} from "../model/user";
import {NotificationType} from "../enum/notification-type.enum";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  showLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router,
              private authService: AuthenticationService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    }
  }

  onRegister(user: User) {
    this.showLoading = true;
    console.log(user);
    this.subscriptions.push(
      this.authService.register(user).subscribe(
        (response: User) => {
          this.showLoading = false;
          this.router.navigateByUrl('/login');
          this.sendNotification(NotificationType.SUCCESS, `Welcome ${response.firstName}! Check your emails for password.`);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.sendNotification(NotificationType.ERROR, error.error.message);
          this.showLoading = false;
        }
      )
    );
  }

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
