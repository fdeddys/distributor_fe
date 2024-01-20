import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderPaymentComponent } from './sales-order-payment.component';

describe('SalesOrderPaymentComponent', () => {
  let component: SalesOrderPaymentComponent;
  let fixture: ComponentFixture<SalesOrderPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesOrderPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
