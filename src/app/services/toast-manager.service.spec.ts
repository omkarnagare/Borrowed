import { TestBed } from '@angular/core/testing';

import { ToastManagerService } from './toast-manager.service';

describe('ToastManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToastManagerService = TestBed.get(ToastManagerService);
    expect(service).toBeTruthy();
  });
});
