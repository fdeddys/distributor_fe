import { TestBed } from '@angular/core/testing';

import { AdjustmentDetailService } from './adjustment-detail.service';

describe('AdjustmentDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdjustmentDetailService = TestBed.get(AdjustmentDetailService);
    expect(service).toBeTruthy();
  });
});
