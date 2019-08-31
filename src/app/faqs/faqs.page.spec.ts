import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FAQsPage } from './faqs.page';

describe('FAQsPage', () => {
  let component: FAQsPage;
  let fixture: ComponentFixture<FAQsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FAQsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FAQsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
