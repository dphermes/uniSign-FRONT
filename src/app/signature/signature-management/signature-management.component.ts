import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubSink} from "subsink";
import {Signature} from "../../model/signature";
import {SignatureService} from "../../service/signature.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationType} from "../../enum/notification-type.enum";
import {NotificationService} from "../../service/notification.service";
import {RoleService} from "../../service/role.service";
import {ModalService} from "../../service/modal.service";
import {NgForm} from "@angular/forms";
import {CustomHttpResponse} from "../../model/custom-http-response";
import {AuthenticationService} from "../../service/authentication.service";
import {User} from "../../model/user";
import {Agency} from "../../model/agency";
import {AgencyService} from "../../service/agency.service";

@Component({
  selector: 'app-signature-management',
  templateUrl: './signature-management.component.html',
  styleUrls: ['./signature-management.component.scss']
})
export class SignatureManagementComponent implements OnInit, OnDestroy {

  public signatures: Signature[] = [];
  editSignature = new Signature();
  private currentSignatureLabel = '';
  loggedInUser = new User();
  showLoading = false;
  private subscriptions = new SubSink();
  agencies: Agency[] = [];

  constructor(private signatureService: SignatureService,
              private agencyService: AgencyService,
              public roleService: RoleService,
              public authService: AuthenticationService,
              private notificationService: NotificationService,
              private modalService: ModalService) { }

  ngOnInit(): void {
    this.getLoggedInUser();
    this.getSignatures();
    this.getAgencies();
  }

  private getLoggedInUser() {
      this.loggedInUser = this.authService.getUserFromLocalStorage();
  }

  public getAgencies() {
    this.showLoading = true;
    this.subscriptions.add(
      this.agencyService.getAgencies().subscribe(
        (response: Agency[]) => {
          this.agencies = response;
          this.showLoading = false;
          console.log(this.signatures);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }

      )
    );
  }

  public getSignatures() {
    this.showLoading = true;
    this.subscriptions.add(
      this.signatureService.getSignatures().subscribe(
        (response: Signature[]) => {
          this.signatures = response;
          this.showLoading = false;
          console.log(this.signatures);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }

      )
    );
  }

  onAddNewSignature(addSignatureForm: NgForm) {
    // @ts-ignore
    const formData = this.signatureService.createSignatureFormData(null, this.loggedInUser.username, addSignatureForm.value);
    this.subscriptions.add(
      this.signatureService.addSignature(formData).subscribe(
        (response: Signature) => {
          this.onCloseModals();
          this.sendNotification(NotificationType.SUCCESS, `${response.label} added successfully`);
          this.getSignatures();
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    )
  }

  onUpdateSignature() {
    const formData = this.signatureService.createSignatureFormData(this.currentSignatureLabel, this.loggedInUser.username, this.editSignature);
    this.subscriptions.add(
      this.signatureService.updateSignature(formData).subscribe(
      (response: Signature) => {
          this.onCloseModals();
          this.sendNotification(NotificationType.SUCCESS, `${response.label} updated successfully`);
          this.getSignatures();
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    )
  }

  onDeleteSignature(signatureId: string) {
    this.showLoading = true;
    this.subscriptions.add(
      this.signatureService.deleteSignature(signatureId).subscribe(
        (response: CustomHttpResponse) => {
          this.onCloseModals();
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.showLoading = false;
          this.getSignatures();
        },
        (error: HttpErrorResponse) => {
          this.showLoading = false;
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  onEditSignature(signature: Signature) {
    this.editSignature = signature;
    this.currentSignatureLabel = signature.label;
    SignatureManagementComponent.clickButton('openEditModal' + signature.signatureId);
  }

  /**
   * Aims the button in hidden profile image form to click it programmatically
   * @param buttonId string: button id
   * @private
   */
  private static clickButton(buttonId: string): void {
    // @ts-ignore
    document.getElementById(buttonId).click();
  }

  /**
   * Calls modal service to open modals
   * @param modalName string: name of the modal we want to open
   */
  onOpenModal(modalName: string): void {
    this.modalService.openModal(modalName);
  }

  /**
   * Calls modal service to close modals
   */
  onCloseModals(): void {
    this.modalService.closeModals();
  }

  /**
   * Calls Notification Service to notify in this component
   * @param notificationType NotificationType: notification type (e.g: ERROR, SUCCESS...)
   * @param message string: Message to show in the notification
   * @private
   */
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
