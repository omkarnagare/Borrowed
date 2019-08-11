import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  urgentMissingItems: Observable<Item[]>;

  constructor(
    private _itemsService: ItemsService
  ) {
    this.urgentMissingItems = this._itemsService.getUrgentItems();
    this.urgentMissingItems.subscribe((data) => {
      console.log("urgent items: ", data);
    });
  }

  ngOnInit() {

  }

}
