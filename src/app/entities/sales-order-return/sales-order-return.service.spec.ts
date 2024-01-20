import { TestBed } from '@angular/core/testing';

import { SalesOrderReturnService } from './sales-order-return.service';

describe('SalesOrderReturnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesOrderReturnService = TestBed.get(SalesOrderReturnService);
    expect(service).toBeTruthy();
  });
});
