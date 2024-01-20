import { TestBed } from '@angular/core/testing';

import { SalesOrderPaymentService } from './sales-order-payment.service';

describe('SalesOrderPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesOrderPaymentService = TestBed.get(SalesOrderPaymentService);
    expect(service).toBeTruthy();
  });
});
