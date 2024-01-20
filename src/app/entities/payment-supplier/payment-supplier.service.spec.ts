import { TestBed } from '@angular/core/testing';

import { PaymentSupplierService } from './payment-supplier.service';

describe('PaymentSupplierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentSupplierService = TestBed.get(PaymentSupplierService);
    expect(service).toBeTruthy();
  });
});
