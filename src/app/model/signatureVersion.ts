import {User} from "./user";

export class SignatureVersion {
  public signatureVersionId: string;
  public creationDate: Date;
  public lastModificationDateDisplay: Date;
  public createdByUser: User;
  public lastModifiedByUser: User;
  public active: boolean;
  public isValidatedByManager: boolean;
  public htmlSignature: string;
  public status: string;

  constructor() {
    this.signatureVersionId = '';
    this.creationDate = new Date();
    this.lastModificationDateDisplay = new Date();
    this.createdByUser = new User();
    this.lastModifiedByUser = new User();
    this.active = false;
    this.isValidatedByManager = false;
    this.htmlSignature = '';
    this.status = '';
  }
}
