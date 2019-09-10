import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';
import { LoaderManagerService } from '../services/loader-manager.service';
import { ToastManagerService } from '../services/toast-manager.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-urgent-items',
  templateUrl: 'urgent-items.page.html',
  styleUrls: ['urgent-items.page.scss']
})
export class UrgentItemsPage implements OnInit, AfterViewInit, OnDestroy {

  backButtonSubscription$: Subscription;

  urgentLentItems: Observable<Item[]>;
  urgentItems$: Subscription;

  constructor(
    private _platform: Platform,
    private _itemsService: ItemsService,
    private _loader: LoaderManagerService,
    private _toastManager: ToastManagerService
  ) {
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.backButtonSubscription$ = this._platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

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
    this._loader.presentLoader().then(() => {
      lentItem.isUrgent = !lentItem.isUrgent;
      this._itemsService.updateItem(id, { isUrgent: lentItem.isUrgent }).then((result) => {
        const message = lentItem.isUrgent
          ? "Item \"" + lentItem.itemName + "\" added to urgent List"
          : "Item \"" + lentItem.itemName + "\" removed from urgent List"
        this._toastManager.showToast(message);
      }).catch((error) => {
        this._toastManager.showErrorToast(error);
      }).finally(() => {
        this._loader.stopLoader();
      });
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription$.unsubscribe();
    this.urgentItems$.unsubscribe();
    this.urgentItems$ = null;
    this.urgentLentItems = null;
  }

}
