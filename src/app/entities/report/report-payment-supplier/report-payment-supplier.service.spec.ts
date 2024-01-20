import { TestBed } from '@angular/core/testing';

import { ReportPaymentSupplierService } from './report-payment-supplier.service';

describe('ReportPaymentSupplierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportPaymentSupplierService = TestBed.get(ReportPaymentSupplierService);
    expect(service).toBeTruthy();
  });
});
