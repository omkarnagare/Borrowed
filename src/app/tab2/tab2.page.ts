import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  urgentMissingItems: Observable<any>;

  constructor(
    itemsService: ItemsService
  ) {
    this.urgentMissingItems = itemsService.getItems();
  }

}
