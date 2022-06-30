import {User} from "./user";
import {SignatureVersion} from "./signatureVersion";
import {Agency} from "./agency";

export class Signature {
  public signatureId: string;
  public label: string;
  public creationDate: Date;
  public lastModificationDateDisplay: Date;
  public createdByUser: User;
  public lastModifiedByUser: User;
  public applyToAgencies: Agency[];
  public active: boolean;
  public htmlSignature: string;
  public status: string;

  constructor() {
    this.signatureId = '';
    this.label = '';
    this.creationDate = new Date();
    this.lastModificationDateDisplay = new Date();
    this.createdByUser = new User();
    this.lastModifiedByUser = new User();
    this.applyToAgencies = [];
    this.active = false;
    this.htmlSignature = '';
    this.status = '';
  }
}
