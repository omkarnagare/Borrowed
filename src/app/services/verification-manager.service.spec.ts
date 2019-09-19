import { TestBed } from '@angular/core/testing';

import { VerificationManagerService } from './verification-manager.service';

describe('VerificationManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VerificationManagerService = TestBed.get(VerificationManagerService);
    expect(service).toBeTruthy();
  });
});
