import { TestBed, async, inject } from '@angular/core/testing';

import { CanEnterTabsPagesGuard } from './can-enter-tabs-pages.guard';

describe('CanEnterTabsPagesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanEnterTabsPagesGuard]
    });
  });

  it('should ...', inject([CanEnterTabsPagesGuard], (guard: CanEnterTabsPagesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
