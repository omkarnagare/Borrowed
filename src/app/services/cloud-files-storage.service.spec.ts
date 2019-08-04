import { TestBed } from '@angular/core/testing';

import { CloudFilesStorageService } from './cloud-files-storage.service';

describe('CloudFilesStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloudFilesStorageService = TestBed.get(CloudFilesStorageService);
    expect(service).toBeTruthy();
  });
});
