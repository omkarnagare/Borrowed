import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinUnlockPage } from './pin-unlock.page';

describe('PinUnlockPage', () => {
  let component: PinUnlockPage;
  let fixture: ComponentFixture<PinUnlockPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinUnlockPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinUnlockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
