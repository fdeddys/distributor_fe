import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSupplierSearchReceiveModalComponent } from './payment-supplier-search-receive-modal.component';

describe('PaymentSupplierSearchReceiveModalComponent', () => {
  let component: PaymentSupplierSearchReceiveModalComponent;
  let fixture: ComponentFixture<PaymentSupplierSearchReceiveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSupplierSearchReceiveModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSupplierSearchReceiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
