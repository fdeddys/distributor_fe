import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppParameterComponent } from './app-parameter.component';

describe('AppParameterComponent', () => {
  let component: AppParameterComponent;
  let fixture: ComponentFixture<AppParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
