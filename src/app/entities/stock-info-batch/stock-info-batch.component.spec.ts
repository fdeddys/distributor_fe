import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInfoBatchComponent } from './stock-info-batch.component';

describe('StockInfoBatchComponent', () => {
  let component: StockInfoBatchComponent;
  let fixture: ComponentFixture<StockInfoBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockInfoBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInfoBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
