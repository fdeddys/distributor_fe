import { TestBed } from '@angular/core/testing';

import { ReceivingDetailService } from './receiving-detail.service';

describe('ReceivingDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReceivingDetailService = TestBed.get(ReceivingDetailService);
    expect(service).toBeTruthy();
  });
});
