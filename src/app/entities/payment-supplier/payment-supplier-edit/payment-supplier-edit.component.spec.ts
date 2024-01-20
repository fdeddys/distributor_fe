import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSupplierEditComponent } from './payment-supplier-edit.component';

describe('PaymentSupplierEditComponent', () => {
  let component: PaymentSupplierEditComponent;
  let fixture: ComponentFixture<PaymentSupplierEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSupplierEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSupplierEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
