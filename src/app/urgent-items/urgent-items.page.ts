import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';

@Component({
  selector: 'app-urgent-items',
  templateUrl: 'urgent-items.page.html',
  styleUrls: ['urgent-items.page.scss']
})
export class UrgentItemsPage implements OnInit, OnDestroy {

  urgentLentItems: Observable<Item[]>;
  urgentItems$: Subscription;

  constructor(
    private _itemsService: ItemsService
  ) {
  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.urgentLentItems = this._itemsService.getUrgentItems();
    this.urgentItems$ = this.urgentLentItems.subscribe((data) => {
      console.log("urgent items: ", data);
    });
  }

  removeItem(item: Item) {
    this._itemsService.remove(item);
  }

  toggleUrgentStatus(id: string, lentItem: Item) {
    this._itemsService.presentLoader().then(() => {
      lentItem.isUrgent = !lentItem.isUrgent;
      this._itemsService.updateItem(id, { isUrgent: lentItem.isUrgent }).then((result) => {
        const message = lentItem.isUrgent
          ? "Item \"" + lentItem.itemName + "\" added to urgent List"
          : "Item \"" + lentItem.itemName + "\" removed from urgent List"
        this._itemsService.showToast(message);
      }).catch((error) => {
        this._itemsService.showToast(error);
      }).finally(() => {
        this._itemsService.stopLoader();
      });
    });
  }

  ngOnDestroy() {
    this.urgentItems$.unsubscribe();
    this.urgentItems$ = null;
    this.urgentLentItems = null;
  }

}
