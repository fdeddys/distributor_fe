import { TestBed } from '@angular/core/testing';

import { AdjustmentService } from './adjustment.service';

describe('AdjustmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdjustmentService = TestBed.get(AdjustmentService);
    expect(service).toBeTruthy();
  });
});
