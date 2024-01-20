import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModalReturnComponent } from './payment-modal-return.component';

describe('PaymentModalReturnComponent', () => {
  let component: PaymentModalReturnComponent;
  let fixture: ComponentFixture<PaymentModalReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentModalReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentModalReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
