import {Component} from '@angular/core';
import {AuthenticationService} from "./service/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dropdownOpen = false;
  notificationOpen = false;
  sidebarOpen = false;

  constructor(public authService: AuthenticationService) {
  }

  onDropdownOpen() {

  }

  logout() {
    this.authService.logout();
  }
}
