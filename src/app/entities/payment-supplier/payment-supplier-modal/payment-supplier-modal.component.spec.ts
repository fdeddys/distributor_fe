import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSupplierModalComponent } from './payment-supplier-modal.component';

describe('PaymentSupplierModalComponent', () => {
  let component: PaymentSupplierModalComponent;
  let fixture: ComponentFixture<PaymentSupplierModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSupplierModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSupplierModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
