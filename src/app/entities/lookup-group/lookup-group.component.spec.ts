import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupGroupComponent } from './lookup-group.component';

describe('LookupGroupComponent', () => {
  let component: LookupGroupComponent;
  let fixture: ComponentFixture<LookupGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookupGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
