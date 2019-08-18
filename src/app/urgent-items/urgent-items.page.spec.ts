import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgentItemsPage } from './urgent-items.page';

describe('UrgentItemsPage', () => {
  let component: UrgentItemsPage;
  let fixture: ComponentFixture<UrgentItemsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UrgentItemsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgentItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
