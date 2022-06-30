import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../model/user";
import {SubSink} from "subsink";
import {Router} from "@angular/router";
import {UserService} from "../service/user.service";
import {AuthenticationService} from "../service/authentication.service";
import {RoleService} from "../service/role.service";
import {NotificationService} from "../service/notification.service";
import {ModalService} from "../service/modal.service";
import {NotificationType} from "../enum/notification-type.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {CustomHttpResponse} from "../model/custom-http-response";
import {Agency} from "../model/agency";
import {AgencyService} from "../service/agency.service";

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.scss']
})
export class AgencyComponent implements OnInit, OnDestroy {
  public agencies: Agency[] = [];
  editAgency = new Agency();
  private currentAgencyLabel = '';
  showLoading = false;
  loggedInUser = new User();
  private subscriptions = new SubSink();

  constructor(private router: Router,
              private agencyService: AgencyService,
              private authService: AuthenticationService,
              public roleService: RoleService,
              private userService: UserService,
              private notificationService: NotificationService,
              private modalService: ModalService) {
  }

  ngOnInit(): void {
    this.getLoggedInUser();
    this.getAgencies(false);
  }

  private getLoggedInUser() {
    this.loggedInUser = this.authService.getUserFromLocalStorage();
  }

  /**
   * Fetch the whole list of agencies
   * @param showNotification boolean: if you want to show a notification with the amount of retrieved agency
   */
  public getAgencies(showNotification: boolean) {
    this.showLoading = true;
    this.subscriptions.add(
      this.agencyService.getAgencies().subscribe(
        (response: Agency[]) => {
          if (response) {
            this.agencies = response;
          }

          this.showLoading = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} agency(ies) loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  /**
   * Search agencies by label, address or agencyId in the list of agencies
   * @param searchTerm string: label, address or agencyId to search
   */
  public searchAgency(searchTerm: string): void {
    const results: Agency[] = [];
    for (const agency of this.agencies) {
      // Put everything to lowercase because indexOf is case sensitive
      if (agency.label.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        agency.address.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        agency.agencyId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        results.push(agency);
      }
    }
    this.agencies = results;
    if (results.length === 0 || !searchTerm) {
      this.agencyService.getAgencies().subscribe(
        (results: Agency[]) => {
          this.agencies = results;
        }
      );
    }
  }

  /**
   * Load user's info to send it in the form and opens the modal
   * @param editUser
   */
  onEditAgency(editAgency: Agency) {
    this.editAgency = editAgency;
    console.log(this.editAgency);
    this.currentAgencyLabel = editAgency.label;
    AgencyComponent.clickButton('openEditModal' + editAgency.agencyId);
  }

  updateAgency(): void {
    const formData = this.agencyService.createAgencyFormData(this.currentAgencyLabel, this.loggedInUser.username, this.editAgency);
    this.subscriptions.add(
      this.agencyService.updateAgency(formData).subscribe(
        (response: Agency) => {
          this.sendNotification(NotificationType.SUCCESS, `${response.label} updated successfully!`);
          this.getAgencies(true);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  /**
   * Add a new agency to the database
   * @param userForm: Form with new agency's information
   */
  onAddNewAgency(userForm: NgForm): void {
    // @ts-ignore
    const formData = this.agencyService.createAgencyFormData(null, this.loggedInUser.username, userForm.value);
    this.subscriptions.add(
      this.agencyService.addAgency(formData).subscribe(
        (response: Agency) => {
          userForm.reset();
          this.onCloseModals();
          this.sendNotification(NotificationType.SUCCESS, `${response.label} added successfully`);
          this.getAgencies(false);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  /**
   * Delete an agency from the database
   * @param agencyId string: agencyId of Agency to delete
   */
  onDeleteAgency(agencyId: string): void {
    this.showLoading = true;
    this.subscriptions.add(
      this.agencyService.deleteAgency(agencyId).subscribe(
        (response: CustomHttpResponse) => {
          this.onCloseModals();
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.showLoading = false;
          this.getAgencies(false);
        },
        (error: HttpErrorResponse) => {
          this.showLoading = false;
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
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
    console.log(modalName);
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
