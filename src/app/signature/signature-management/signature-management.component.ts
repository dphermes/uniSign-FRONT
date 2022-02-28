import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubSink} from "subsink";
import {Signature} from "../../model/signature";
import {SignatureService} from "../../service/signature.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationType} from "../../enum/notification-type.enum";
import {NotificationService} from "../../service/notification.service";
import {RoleService} from "../../service/role.service";
import {ModalService} from "../../service/modal.service";

@Component({
  selector: 'app-signature-management',
  templateUrl: './signature-management.component.html',
  styleUrls: ['./signature-management.component.scss']
})
export class SignatureManagementComponent implements OnInit, OnDestroy {

  public signatures: Signature[] = [];
  showLoading = false;
  private subscriptions = new SubSink();

  constructor(private signatureService: SignatureService,
              public roleService: RoleService,
              private notificationService: NotificationService,
              private modalService: ModalService) { }

  ngOnInit(): void {
    this.getSignatures();
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
