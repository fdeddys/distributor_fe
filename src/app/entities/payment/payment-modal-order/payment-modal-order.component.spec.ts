import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModalOrderComponent } from './payment-modal-order.component';

describe('PaymentModalOrderComponent', () => {
  let component: PaymentModalOrderComponent;
  let fixture: ComponentFixture<PaymentModalOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentModalOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentModalOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
