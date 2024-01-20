import { TestBed } from '@angular/core/testing';

import { PaymentSupplierDetailService } from './payment-supplier-detail.service';

describe('PaymentSupplierDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentSupplierDetailService = TestBed.get(PaymentSupplierDetailService);
    expect(service).toBeTruthy();
  });
});
