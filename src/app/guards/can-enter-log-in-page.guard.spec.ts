import { TestBed, async, inject } from '@angular/core/testing';

import { CanEnterLogInPageGuard } from './can-enter-log-in-page.guard';

describe('CanEnterLogInPageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanEnterLogInPageGuard]
    });
  });

  it('should ...', inject([CanEnterLogInPageGuard], (guard: CanEnterLogInPageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
