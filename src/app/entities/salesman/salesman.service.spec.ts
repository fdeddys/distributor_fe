import { TestBed } from '@angular/core/testing';

import { SalesmanService } from './salesman.service';

describe('SalesmanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesmanService = TestBed.get(SalesmanService);
    expect(service).toBeTruthy();
  });
});
