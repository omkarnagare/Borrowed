import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscationCompleteItemsPage } from './transcation-complete-items.page';

describe('TranscationCompleteItemsPage', () => {
  let component: TranscationCompleteItemsPage;
  let fixture: ComponentFixture<TranscationCompleteItemsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranscationCompleteItemsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscationCompleteItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
