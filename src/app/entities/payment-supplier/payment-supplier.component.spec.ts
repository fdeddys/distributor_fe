import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSupplierComponent } from './payment-supplier.component';

describe('PaymentSupplierComponent', () => {
  let component: PaymentSupplierComponent;
  let fixture: ComponentFixture<PaymentSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
