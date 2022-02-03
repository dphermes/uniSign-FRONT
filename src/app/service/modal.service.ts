import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private openedModals: string[] = [];

  constructor() { }

  /**
   * Opens a modal in template and stores it in an array to close later
   * @param modalName string: name of the modal we want to open
   */
  openModal(modalName: string): void {
    this.closeModals();
    this.openedModals.push(modalName);
    if (modalName.includes('userDropDown')) {
      // @ts-ignore
      document.getElementById('modalOverlay').style.display='block';
      this.openedModals.push('modalOverlay');
    }
    // @ts-ignore
    document.getElementById(modalName).style.display='block';
    console.log(this.openedModals);
  }

  /**
   * Closes all modals opened and stored in openedModals array
   */
  closeModals(): void {
    for (let modal of this.openedModals) {
      // @ts-ignore
      document.getElementById(modal).style.display='none';
    }
    this.openedModals = [];
  }
}
