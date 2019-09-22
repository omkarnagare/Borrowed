import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantItemsPage } from './important-items.page';

describe('ImportantItemsPage', () => {
  let component: ImportantItemsPage;
  let fixture: ComponentFixture<ImportantItemsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportantItemsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportantItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
