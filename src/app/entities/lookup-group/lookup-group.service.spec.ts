import { TestBed } from '@angular/core/testing';

import { LookupGroupService } from './lookup-group.service';

describe('LookupGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LookupGroupService = TestBed.get(LookupGroupService);
    expect(service).toBeTruthy();
  });
});
