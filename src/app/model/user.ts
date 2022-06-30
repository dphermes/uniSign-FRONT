import {Agency} from "./agency";

export class User {
  public userId: string;
  public firstName: string;
  public lastName: string;
  public username: string;
  public email: string;
  public agency: Agency;
  public lastLoginDateDisplay: Date;
  public joinDate: Date;
  public profileImageUrl: string;
  public active: boolean;
  public notLocked: boolean;
  public role: string;
  public authorities: [];

  constructor() {
    this.userId = '';
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.agency = new Agency();
    this.lastLoginDateDisplay = new Date();
    this.joinDate = new Date();
    this.profileImageUrl = '';
    this.active = true;
    this.notLocked = true;
    this.role = '';
    this.authorities = [];
  }
}
