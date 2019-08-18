import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';

@Component({
  selector: 'app-urgent-items',
  templateUrl: 'urgent-items.page.html',
  styleUrls: ['urgent-items.page.scss']
})
export class UrgentItemsPage implements OnInit{

  urgentMissingItems: Observable<Item[]>;

  constructor(
    private _itemsService: ItemsService
  ) {
    this.urgentMissingItems = this._itemsService.getUrgentItems();
    // this.urgentMissingItems.subscribe((data) => {
    //   console.log("urgent items: ", data);
    // });
  }

  ngOnInit() {

  }

  removeItem(id: string) {
    this._itemsService.deleteItem(id);
  }

  toggleUrgentStatus(id: string, lentItem: Item) {
    lentItem.isUrgent = !lentItem.isUrgent;
    this._itemsService.updateItem(id, lentItem).then((result) => {
      const message = lentItem.isUrgent
        ? "Item " + lentItem.itemName + " added to urgent List"
        : "Item " + lentItem.itemName + " removed from urgent List"
      this._itemsService.showToast(message);
    }).catch((error) => {
      this._itemsService.showToast(error);
    });
  }

}
