import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingSearchPoModalComponent } from './receiving-search-po-modal.component';

describe('ReceivingSearchPoModalComponent', () => {
  let component: ReceivingSearchPoModalComponent;
  let fixture: ComponentFixture<ReceivingSearchPoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivingSearchPoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingSearchPoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
