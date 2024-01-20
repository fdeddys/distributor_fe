import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderModalComponent } from './sales-order-modal.component';

describe('SalesOrderModalComponent', () => {
  let component: SalesOrderModalComponent;
  let fixture: ComponentFixture<SalesOrderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesOrderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
