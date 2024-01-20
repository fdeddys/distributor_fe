import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryStockComponent } from './history-stock.component';

describe('HistoryStockComponent', () => {
  let component: HistoryStockComponent;
  let fixture: ComponentFixture<HistoryStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
