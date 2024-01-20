import { TestBed } from '@angular/core/testing';

import { ApotikParamService } from './apotik-param.service';

describe('ApotikParamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApotikParamService = TestBed.get(ApotikParamService);
    expect(service).toBeTruthy();
  });
});
