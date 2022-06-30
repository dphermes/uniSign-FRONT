import { Injectable } from '@angular/core';
import {Role} from "../enum/role.enum";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private authService: AuthenticationService) { }

  /**
   * Check if current user is an admin
   */
  public get isSuperAdmin(): boolean {
    return this.getUserRole() === Role.SUPER_ADMIN;
  }
  /**
   * Check if current user is an admin
   */
  public get isAdmin(): boolean {
    return this.isSuperAdmin || this.getUserRole() === Role.ADMIN;
  }

  /**
   * Check if current user is a manager
   */
  public get isManager(): boolean {
    return this.isSuperAdmin || this.isAdmin || this.getUserRole() === Role.MANAGER;
  }

  /**
   * Check if current user is an admin or manager
   */
  public get isAdminOrManager(): boolean {
    return this.isSuperAdmin || this.isAdmin || this.isManager;
  }

  /**
   * Get current user's role
   * @private
   */
  private getUserRole(): string {
    return this.authService.getUserFromLocalStorage().role;
  }
}
