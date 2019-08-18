import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowedPage } from './borrowed.page';

describe('BorrowedPage', () => {
  let component: BorrowedPage;
  let fixture: ComponentFixture<BorrowedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BorrowedPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
