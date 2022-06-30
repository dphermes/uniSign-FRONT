import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureDetailsComponent } from './signature-details.component';

describe('SignatureDetailsComponent', () => {
  let component: SignatureDetailsComponent;
  let fixture: ComponentFixture<SignatureDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
