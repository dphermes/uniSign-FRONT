export class User {
  public id: number;
  public userId: string;
  public firstName: string;
  public lastName: string;
  public username: string;
  public email: string;
  public loginDateDisplay: Date;
  public joinDate: Date;
  public profileImageUrl: string;
  public isActive: boolean;
  public isNotLocked: boolean;
  public role: string;
  public authorities: [];


  constructor() {
    this.id = 0;
    this.userId = '';
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.loginDateDisplay = new Date();
    this.joinDate = new Date();
    this.profileImageUrl = '';
    this.isActive = false;
    this.isNotLocked = false;
    this.role = '';
    this.authorities = [];
  }
}
