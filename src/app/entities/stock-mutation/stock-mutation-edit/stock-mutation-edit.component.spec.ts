import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMutationEditComponent } from './stock-mutation-edit.component';

describe('StockMutationEditComponent', () => {
  let component: StockMutationEditComponent;
  let fixture: ComponentFixture<StockMutationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockMutationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockMutationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
