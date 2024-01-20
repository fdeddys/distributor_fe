import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApotikParamComponent } from './apotik-param.component';

describe('ApotikParamComponent', () => {
  let component: ApotikParamComponent;
  let fixture: ComponentFixture<ApotikParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApotikParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApotikParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
