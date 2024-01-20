import { TestBed } from '@angular/core/testing';

import { SystemParameterService } from './system-parameter.service';

describe('SystemParameterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemParameterService = TestBed.get(SystemParameterService);
    expect(service).toBeTruthy();
  });
});
