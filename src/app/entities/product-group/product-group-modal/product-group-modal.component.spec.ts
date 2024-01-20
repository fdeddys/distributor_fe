import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGroupModalComponent } from './product-group-modal.component';

describe('ProductGroupModalComponent', () => {
  let component: ProductGroupModalComponent;
  let fixture: ComponentFixture<ProductGroupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductGroupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
