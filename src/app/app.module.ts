import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {AuthenticationService} from "./service/authentication.service";
import {UserService} from "./service/user.service";
import {AuthGuard} from "./guard/auth.guard";
import {NotificationModule} from "./notification.module";
import {NotificationService} from "./service/notification.service";
import {LoginComponent} from './login/login.component';
import {FormsModule} from "@angular/forms";
import {UserManagementComponent} from './user/user-management/user-management.component';
import { RegisterComponent } from './register/register.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserManagementComponent,
    RegisterComponent,
    UserAddComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NotificationModule,
    FormsModule
  ],
  providers: [
    AuthenticationService,
    UserService,
    NotificationService,
    AuthGuard,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
