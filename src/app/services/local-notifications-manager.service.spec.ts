import { TestBed } from '@angular/core/testing';

import { LocalNotificationsManagerService } from './local-notifications-manager.service';

describe('LocalNotificationsManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalNotificationsManagerService = TestBed.get(LocalNotificationsManagerService);
    expect(service).toBeTruthy();
  });
});
