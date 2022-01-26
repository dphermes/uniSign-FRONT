export class User {
  private id: number;
  private userId: string;
  private firstName: string;
  private lastName: string;
  private username: string;
  private email: string;
  private loginDateDisplay: Date;
  private joinDate: Date;
  private profileImageUrl: string;
  private isActive: boolean;
  private isNotLocked: boolean;
  private role: string;
  private authorities: string[];


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
