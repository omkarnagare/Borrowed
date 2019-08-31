import { TestBed } from '@angular/core/testing';

import { ItemsService } from './items.service';

const items = [{itemId: 'A'}, {itemId: 'B'}]
const mockService = <ItemsService> { getActiveItems: () => this.items }

describe('ItemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ItemsService = TestBed.get(ItemsService);
    expect(service).toBeTruthy();
  });
});
