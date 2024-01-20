import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockOpnameComponent } from './stock-opname.component';

describe('StockOpnameComponent', () => {
  let component: StockOpnameComponent;
  let fixture: ComponentFixture<StockOpnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockOpnameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOpnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
