import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureBuilderComponent } from './signature-builder.component';

describe('SignatureBuilderComponent', () => {
  let component: SignatureBuilderComponent;
  let fixture: ComponentFixture<SignatureBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
