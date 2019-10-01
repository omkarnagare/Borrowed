import { TestBed } from '@angular/core/testing';

import { PushNotificationsManagerService } from './push-notifications-manager.service';

describe('PushNotificationsManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PushNotificationsManagerService = TestBed.get(PushNotificationsManagerService);
    expect(service).toBeTruthy();
  });
});
