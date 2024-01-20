import { TestBed } from '@angular/core/testing';

import { StockMutationService } from './stock-mutation.service';

describe('StockMutationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockMutationService = TestBed.get(StockMutationService);
    expect(service).toBeTruthy();
  });
});
