import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnReceivingModalComponent } from './return-receiving-modal.component';

describe('ReturnReceivingModalComponent', () => {
  let component: ReturnReceivingModalComponent;
  let fixture: ComponentFixture<ReturnReceivingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnReceivingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnReceivingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
