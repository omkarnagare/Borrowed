import { TestBed } from '@angular/core/testing';

import { LoaderManagerService } from './loader-manager.service';

describe('LoaderManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoaderManagerService = TestBed.get(LoaderManagerService);
    expect(service).toBeTruthy();
  });
});
