import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFinderPage } from './contact-finder.page';

describe('ContactFinderPage', () => {
  let component: ContactFinderPage;
  let fixture: ComponentFixture<ContactFinderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactFinderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFinderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
