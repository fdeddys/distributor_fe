import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderPaymentEditComponent } from './sales-order-payment-edit.component';

describe('SalesOrderPaymentEditComponent', () => {
  let component: SalesOrderPaymentEditComponent;
  let fixture: ComponentFixture<SalesOrderPaymentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesOrderPaymentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderPaymentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
