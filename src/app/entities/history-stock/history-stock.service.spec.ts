import { TestBed } from '@angular/core/testing';

import { HistoryStockService } from './history-stock.service';

describe('HistoryStockService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoryStockService = TestBed.get(HistoryStockService);
    expect(service).toBeTruthy();
  });
});
