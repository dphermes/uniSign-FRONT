import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from "../service/authentication.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes(`${this.authService.host}/user/login`) ||
      request.url.includes(`${this.authService.host}/user/register`) ||
      request.url.includes(`${this.authService.host}/user/reset-password`)) {
      return next.handle(request);
    } else {
      this.authService.loadToken();
      const token = this.authService.getToken();
      // Since the request is immutable we have to clone it before modifying and sending it
      const cloneRequest = request.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      });
      return next.handle(cloneRequest);
    }
  }
}
