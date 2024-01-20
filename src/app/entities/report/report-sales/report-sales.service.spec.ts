import { TestBed } from '@angular/core/testing';

import { ReportSalesService } from './report-sales.service';

describe('ReportSalesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportSalesService = TestBed.get(ReportSalesService);
    expect(service).toBeTruthy();
  });
});
