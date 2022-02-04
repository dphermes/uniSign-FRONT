import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./service/authentication.service";
import {Router} from "@angular/router";
import {User} from "./model/user";
import {RoleService} from "./service/role.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dropdownOpen = false;
  notificationOpen = false;
  sidebarOpen = true;
  userInit = new User();
  private userSubject = new BehaviorSubject<User>(this.userInit);
  public userAction$ = this.userSubject.asObservable();

  constructor(public authService: AuthenticationService,
              public roleService: RoleService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.changeUser(this.authService.getUserFromLocalStorage());
  }

  changeUser(user: User): void {
    this.userSubject.next(user);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('login').then();
  }

}
