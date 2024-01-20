import { TestBed } from '@angular/core/testing';

import { StockOpnameService } from './stock-opname.service';

describe('StockOpnameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockOpnameService = TestBed.get(StockOpnameService);
    expect(service).toBeTruthy();
  });
});
