import { TestBed } from '@angular/core/testing';

import { StockMutationDetailService } from './stock-mutation-detail.service';

describe('StockMutationDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockMutationDetailService = TestBed.get(StockMutationDetailService);
    expect(service).toBeTruthy();
  });
});
