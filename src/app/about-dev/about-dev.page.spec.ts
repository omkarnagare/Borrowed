import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutDevPage } from './about-dev.page';

describe('AboutDevPage', () => {
  let component: AboutDevPage;
  let fixture: ComponentFixture<AboutDevPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutDevPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDevPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
