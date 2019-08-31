import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';

@Component({
  selector: 'app-transcation-complete-items',
  templateUrl: './transcation-complete-items.page.html',
  styleUrls: ['./transcation-complete-items.page.scss'],
})
export class TranscationCompleteItemsPage implements OnInit, OnDestroy {

  transcationCompleteItems: Observable<Item[]>;
  transcationCompleteItems$: Subscription;

  constructor(
    private _itemsService: ItemsService
  ) {
  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.transcationCompleteItems = this._itemsService.getTransactionCompleteItems();
    this.transcationCompleteItems$ = this.transcationCompleteItems.subscribe((data) => {
      console.log("urgent items: ", data);
    });
  }

  removeItem(item: Item) {
    this._itemsService.remove(item);
  }

  ngOnDestroy() {
    this.transcationCompleteItems$.unsubscribe();
    this.transcationCompleteItems$ = null;
    this.transcationCompleteItems = null;
  }

}
