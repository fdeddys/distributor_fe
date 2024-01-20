import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnReceivingComponent } from './return-receiving.component';

describe('ReturnReceivingComponent', () => {
  let component: ReturnReceivingComponent;
  let fixture: ComponentFixture<ReturnReceivingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnReceivingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnReceivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
