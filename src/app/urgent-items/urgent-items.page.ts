import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';
import { LoaderManagerService } from '../services/loader-manager.service';
import { ToastManagerService } from '../services/toast-manager.service';
import { Platform } from '@ionic/angular';
import { ConfirmExitService } from '../services/confirm-exit.service';

import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-urgent-items',
  templateUrl: 'urgent-items.page.html',
  styleUrls: ['urgent-items.page.scss'],
  animations: [
    trigger('fadein', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slidelefttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }, ))
      ])
    ]),
    trigger('sliderighttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }, ))
      ])
    ]),
    trigger('slidetoptitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }, ))
      ])
    ]),
    trigger('slidebottomtitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }, ))
      ])
    ])
  ]
})
export class UrgentItemsPage implements OnInit, AfterViewInit, OnDestroy {

  backButtonSubscription$: Subscription;

  urgentLentItems: Observable<Item[]> = null;
  urgentItems$: Subscription;

  constructor(
    private _platform: Platform,
    private _itemsService: ItemsService,
    private _confirmExitService: ConfirmExitService,
    private _loader: LoaderManagerService,
    private _toastManager: ToastManagerService
  ) {
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.backButtonSubscription$ = this._platform.backButton.subscribe(() => {
      // navigator['app'].exitApp();
      this._confirmExitService.confirmExit();
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
