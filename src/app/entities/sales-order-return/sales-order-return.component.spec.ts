import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderReturnComponent } from './sales-order-return.component';

describe('SalesOrderReturnComponent', () => {
  let component: SalesOrderReturnComponent;
  let fixture: ComponentFixture<SalesOrderReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesOrderReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
