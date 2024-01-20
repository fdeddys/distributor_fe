import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderReturnEditComponent } from './sales-order-return-edit.component';

describe('SalesOrderReturnEditComponent', () => {
  let component: SalesOrderReturnEditComponent;
  let fixture: ComponentFixture<SalesOrderReturnEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesOrderReturnEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderReturnEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
