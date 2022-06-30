import { Injectable } from '@angular/core';
import {NotifierService} from "angular-notifier";
import {NotificationType} from "../enum/notification-type.enum";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notifier: NotifierService) { }

  /**
   * Sends a notification while to the front end to inform user
   * @param type NotificationType: type of notification (SUCCESS, ERROR, ...)
   * @param message string: message to show to user
   * @private
   */
  public notify(type: NotificationType, message: string) {
    this.notifier.notify(type, message);
  }
}
