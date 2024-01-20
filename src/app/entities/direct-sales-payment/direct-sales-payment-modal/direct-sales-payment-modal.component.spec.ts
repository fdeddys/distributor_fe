import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectSalesPaymentModalComponent } from './direct-sales-payment-modal.component';

describe('DirectSalesPaymentModalComponent', () => {
  let component: DirectSalesPaymentModalComponent;
  let fixture: ComponentFixture<DirectSalesPaymentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectSalesPaymentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectSalesPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
