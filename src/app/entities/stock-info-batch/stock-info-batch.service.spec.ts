import { TestBed } from '@angular/core/testing';

import { StockInfoBatchService } from './stock-info-batch.service';

describe('StockInfoBatchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockInfoBatchService = TestBed.get(StockInfoBatchService);
    expect(service).toBeTruthy();
  });
});
