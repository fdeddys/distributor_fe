import { TestBed } from '@angular/core/testing';

import { ProductGroupService } from './product-group.service';

describe('ProductGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductGroupService = TestBed.get(ProductGroupService);
    expect(service).toBeTruthy();
  });
});
