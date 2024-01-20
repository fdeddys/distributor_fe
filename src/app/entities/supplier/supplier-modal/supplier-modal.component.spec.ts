import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierModalComponent } from './supplier-modal.component';

describe('SupplierModalComponent', () => {
  let component: SupplierModalComponent;
  let fixture: ComponentFixture<SupplierModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
