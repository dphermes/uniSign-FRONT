import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from "../service/authentication.service";
import {NotificationService} from "../service/notification.service";
import {NotificationType} from "../enum/notification-type.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService,
              private notificationService: NotificationService,
              private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    /* For now returns a simple boolean, but if we want to check from the backend
    if a user is logged in or not (e.g: if we don't want to store the token in the localstorage)
     Then we would have to return an Observable<boolean> */
    return true;
  }

  private isUserLoggedIn(): boolean {
    if (this.authService.isUserLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      this.notificationService.notify(NotificationType.ERROR, "You need to log in to access this page".toUpperCase());
      return false;
    }
  }

}
