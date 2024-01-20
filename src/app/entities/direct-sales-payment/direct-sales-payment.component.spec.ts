import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectSalesPaymentComponent } from './direct-sales-payment.component';

describe('DirectSalesPaymentComponent', () => {
  let component: DirectSalesPaymentComponent;
  let fixture: ComponentFixture<DirectSalesPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectSalesPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectSalesPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
