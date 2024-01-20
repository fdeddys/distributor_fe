import { TestBed } from '@angular/core/testing';

import { StockOpnameDetailService } from './stock-opname-detail.service';

describe('StockOpnameDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockOpnameDetailService = TestBed.get(StockOpnameDetailService);
    expect(service).toBeTruthy();
  });
});
