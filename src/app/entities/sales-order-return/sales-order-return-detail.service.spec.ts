import { TestBed } from '@angular/core/testing';

import { SalesOrderReturnDetailService } from './sales-order-return-detail.service';

describe('SalesOrderReturnDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesOrderReturnDetailService = TestBed.get(SalesOrderReturnDetailService);
    expect(service).toBeTruthy();
  });
});
