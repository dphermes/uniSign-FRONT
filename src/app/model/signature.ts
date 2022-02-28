import {User} from "./user";

export class Signature {
  public signatureId: string;
  public label: string;
  public creationDate: Date;
  public lastModificationDateDisplay: Date;
  public createdByUser: User;
  public lastModifiedByUser: User;
  public active: boolean;
  public htmlSignature: string;

  constructor() {
    this.signatureId = '';
    this.label = '';
    this.creationDate = new Date();
    this.lastModificationDateDisplay = new Date();
    this.createdByUser = new User();
    this.lastModifiedByUser = new User();
    this.active = false;
    this.htmlSignature = '';
  }
}
