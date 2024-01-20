import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupModalComponent } from './lookup.modal.component';

describe('Lookup.ModalComponent', () => {
  let component: LookupModalComponent;
  let fixture: ComponentFixture<LookupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
