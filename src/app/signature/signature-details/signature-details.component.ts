import {Component, OnDestroy, OnInit} from '@angular/core';
import {Signature} from "../../model/signature";
import {SignatureService} from "../../service/signature.service";
import {SubSink} from "subsink";
import {ActivatedRoute, Params} from "@angular/router";
import {User} from "../../model/user";
import {AuthenticationService} from "../../service/authentication.service";
import {SignatureVersion} from "../../model/signatureVersion";
import {ModalService} from "../../service/modal.service";
import {RoleService} from "../../service/role.service";
import {NotificationType} from "../../enum/notification-type.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationService} from "../../service/notification.service";
import {Agency} from "../../model/agency";
import {AgencyService} from "../../service/agency.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-signature-details',
  templateUrl: './signature-details.component.html',
  styleUrls: ['./signature-details.component.scss']
})
export class SignatureDetailsComponent implements OnInit, OnDestroy {

  signature = new Signature();
  signatureVersions: SignatureVersion[] = [];
  private currentSignatureId = '';
  private currentSignatureLabel = '';
  loggedInUser = new User();
  isloggedInUser = false;
  allAgencies: Agency[] = [];
  showLoading = false;
  signatureForm = new FormGroup({
    reference: new FormControl(),
    quantity: new FormControl('11')
  });
  private subscriptions = new SubSink();

  constructor(private route: ActivatedRoute,
              private authService: AuthenticationService,
              private modalService: ModalService,
              public roleService: RoleService,
              private agencyService: AgencyService,
              private signatureService: SignatureService,
              private fb: FormBuilder,
              private notificationService: NotificationService) {
    this.initSignatureForm();
  }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getUserFromLocalStorage();
    this.subscriptions.add(
      this.route.params.subscribe(
        (response: Params) => {
          this.currentSignatureId = response['signatureId'];

        }
      ),
      this.signatureService.getSignatureById(this.currentSignatureId).subscribe(
        (result: Signature) => {
          this.signature = result;
          console.log(this.signature);
          // Populate signature form values with fetched signature data
          this.signatureForm.patchValue(result);
          console.log(this.signatureForm);
        }
      ),
      this.signatureService.getSignatureVersionByParentSignatureId(this.currentSignatureId).subscribe(
        (result: SignatureVersion[]) => {
          this.signatureVersions = result;
          console.log(this.signatureVersions);
        }
      )
    )
    this.getAgencies();
  }

  public initSignatureForm() {
    this.signatureForm = this.fb.group({
      label: ['label'],
      applyToAgency: [this.allAgencies[5]],
      active: [false]
    })
  }

  public getAgencies() {
    this.showLoading = true;
    this.subscriptions.add(
      this.agencyService.getAgencies().subscribe(
        (response: Agency[]) => {
          this.allAgencies = response;
          this.showLoading = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }

      )
    );
  }

  onUpdateSignature() {
    const formData = this.signatureService.createSignatureFormData(this.currentSignatureLabel, this.loggedInUser.username, this.signature);

    console.log(formData);
    // this.subscriptions.add(
    //   this.signatureService.updateSignature(formData).subscribe(
    //     (response: Signature) => {
    //       this.onCloseModals();
    //       this.sendNotification(NotificationType.SUCCESS, `${response.label} updated successfully`);
    //     },
    //     (error: HttpErrorResponse) => {
    //       this.sendNotification(NotificationType.ERROR, error.error.message);
    //     }
    //   )
    // )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Calls modal service to open modals
   * @param modalName string: name of the modal we want to open
   */
  onOpenSeeSignatureModal(modalName: string, htmlSignature: string): void {
    this.modalService.openModal(modalName);
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlSignature, 'text/html');
    var dom = document.getElementById('view'+modalName);
    // @ts-ignore
    dom.innerHTML = htmlSignature;
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

  // changeAgency(e: any) {
  //   this.signatureForm.controls['agencies']?.setValue(e.target.value, {
  //     onlySelf: true,
  //   });
  // }
}
