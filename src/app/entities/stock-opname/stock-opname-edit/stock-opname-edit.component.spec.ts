import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockOpnameEditComponent } from './stock-opname-edit.component';

describe('StockOpnameEditComponent', () => {
  let component: StockOpnameEditComponent;
  let fixture: ComponentFixture<StockOpnameEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockOpnameEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOpnameEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
