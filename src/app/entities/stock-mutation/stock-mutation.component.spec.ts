import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMutationComponent } from './stock-mutation.component';

describe('StockMutationComponent', () => {
  let component: StockMutationComponent;
  let fixture: ComponentFixture<StockMutationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockMutationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockMutationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
