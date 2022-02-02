import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./service/authentication.service";
import {Router} from "@angular/router";
import {User} from "./model/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dropdownOpen = false;
  notificationOpen = false;
  sidebarOpen = false;
  user = new User();

  constructor(public authService: AuthenticationService,
              private router: Router) {
  }


  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('login');
  }
}
