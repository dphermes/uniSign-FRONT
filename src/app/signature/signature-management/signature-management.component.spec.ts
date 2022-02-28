import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureManagementComponent } from './signature-management.component';

describe('SignatureManagementComponent', () => {
  let component: SignatureManagementComponent;
  let fixture: ComponentFixture<SignatureManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
