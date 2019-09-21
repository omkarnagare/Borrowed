import { TestBed } from '@angular/core/testing';

import { ConfirmExitService } from './confirm-exit.service';

describe('ConfirmExitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfirmExitService = TestBed.get(ConfirmExitService);
    expect(service).toBeTruthy();
  });
});
