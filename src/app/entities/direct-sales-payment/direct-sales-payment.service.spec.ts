import { TestBed } from '@angular/core/testing';

import { DirectSalesPaymentService } from './direct-sales-payment.service';

describe('DirectSalesPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DirectSalesPaymentService = TestBed.get(DirectSalesPaymentService);
    expect(service).toBeTruthy();
  });
});
