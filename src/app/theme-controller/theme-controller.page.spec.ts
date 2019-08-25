import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeControllerPage } from './theme-controller.page';

describe('ThemeControllerPage', () => {
  let component: ThemeControllerPage;
  let fixture: ComponentFixture<ThemeControllerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeControllerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeControllerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
