import { TestBed } from '@angular/core/testing';

import { ReportPaymentService } from './report-payment.service';

describe('ReportPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportPaymentService = TestBed.get(ReportPaymentService);
    expect(service).toBeTruthy();
  });
});
