import { TestBed } from '@angular/core/testing';

import { ReturnReceivingService } from './return-receiving.service';

describe('ReturnReceivingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReturnReceivingService = TestBed.get(ReturnReceivingService);
    expect(service).toBeTruthy();
  });
});
