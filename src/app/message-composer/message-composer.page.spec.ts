import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageComposerPage } from './message-composer.page';

describe('MessageComposerPage', () => {
  let component: MessageComposerPage;
  let fixture: ComponentFixture<MessageComposerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageComposerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComposerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
