import { TestBed } from '@angular/core/testing';

import { RoleMatrixService } from './role-matrix.service';

describe('RoleMatrixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoleMatrixService = TestBed.get(RoleMatrixService);
    expect(service).toBeTruthy();
  });
});
