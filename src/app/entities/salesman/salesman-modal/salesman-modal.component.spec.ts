import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanModalComponent } from './salesman-modal.component';

describe('SalesmanModalComponent', () => {
  let component: SalesmanModalComponent;
  let fixture: ComponentFixture<SalesmanModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesmanModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
