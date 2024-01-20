import { TestBed } from '@angular/core/testing';

import { ReceivingService } from './receiving.service';

describe('ReceivingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReceivingService = TestBed.get(ReceivingService);
    expect(service).toBeTruthy();
  });
});
