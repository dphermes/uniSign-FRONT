import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubSink} from "subsink";

@Component({
  selector: 'app-signature-management',
  templateUrl: './signature-management.component.html',
  styleUrls: ['./signature-management.component.scss']
})
export class SignatureManagementComponent implements OnInit, OnDestroy {

  showLoading = false;
  private subscriptions = new SubSink();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
