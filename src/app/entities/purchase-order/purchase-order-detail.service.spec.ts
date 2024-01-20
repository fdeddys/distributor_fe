import { TestBed } from '@angular/core/testing';

import { PurchaseOrderDetailService } from './purchase-order-detail.service';

describe('PurchaseOrderDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PurchaseOrderDetailService = TestBed.get(PurchaseOrderDetailService);
    expect(service).toBeTruthy();
  });
});
