import {User} from "./user";

export class Agency {
  public agencyId: string;
  public label: string;
  public address: string;
  public addressComplement: string;
  public zipCode: string;
  public city: string;
  public employees: User[];

  constructor(agencyId?: string, label?: string, address?: string, addressComplement?: string, zipCode?: string, city?: string, employees?: User[]) {
    this.agencyId = '';
    this.label = '';
    this.address = '';
    this.addressComplement = '';
    this.zipCode = '';
    this.city = '';
    this.employees = [];
  }
}
