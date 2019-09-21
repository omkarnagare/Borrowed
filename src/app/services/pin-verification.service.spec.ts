import { TestBed } from '@angular/core/testing';

import { PinVerificationService } from './pin-verification.service';

describe('PinVerificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PinVerificationService = TestBed.get(PinVerificationService);
    expect(service).toBeTruthy();
  });
});
