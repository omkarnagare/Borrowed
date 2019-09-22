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
  selector: 'app-important-items',
  templateUrl: 'important-items.page.html',
  styleUrls: ['important-items.page.scss'],
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
export class ImportantItemsPage implements OnInit, AfterViewInit, OnDestroy {

  backButtonSubscription$: Subscription;

  importantLentItems: Observable<Item[]> = null;
  importantItems$: Subscription;

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
    this.importantLentItems = this._itemsService.getImportantItems();
    this.importantItems$ = this.importantLentItems.subscribe((data) => {
      console.log("important items: ", data);
    });
  }

  removeItem(item: Item) {
    this._itemsService.remove(item);
  }

  ngOnDestroy() {
    this.backButtonSubscription$.unsubscribe();
    this.importantItems$.unsubscribe();
    this.importantItems$ = null;
    this.importantLentItems = null;
  }

}
