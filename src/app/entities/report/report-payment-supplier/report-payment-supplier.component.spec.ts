import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPaymentSupplierComponent } from './report-payment-supplier.component';

describe('ReportPaymentSupplierComponent', () => {
  let component: ReportPaymentSupplierComponent;
  let fixture: ComponentFixture<ReportPaymentSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPaymentSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPaymentSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
