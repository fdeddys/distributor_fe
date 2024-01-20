import { TestBed } from '@angular/core/testing';

import { SalesOrderDetailService } from './sales-order-detail.service';

describe('SalesOrderDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesOrderDetailService = TestBed.get(SalesOrderDetailService);
    expect(service).toBeTruthy();
  });
});
