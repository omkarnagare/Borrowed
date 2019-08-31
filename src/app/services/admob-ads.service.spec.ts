import { TestBed } from '@angular/core/testing';

import { AdmobAdsService } from './admob-ads.service';

describe('AdmobAdsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdmobAdsService = TestBed.get(AdmobAdsService);
    expect(service).toBeTruthy();
  });
});
