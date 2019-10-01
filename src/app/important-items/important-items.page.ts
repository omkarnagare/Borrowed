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
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('sliderighttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('slidetoptitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ]),
    trigger('slidebottomtitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ])
  ]
})
export class ImportantItemsPage implements OnInit, AfterViewInit, OnDestroy {

  backButtonSubscription$: Subscription;

  allItems: Item[] = null;
  items: Item[] = null;
  items$: Subscription;

  itemsType: string;
  searchTerm: string = "";
  searching: boolean;

  constructor(
    private _platform: Platform,
    private _itemsService: ItemsService,
    private _confirmExitService: ConfirmExitService,
    private _loader: LoaderManagerService,
    private _toastManager: ToastManagerService
  ) {
    this.items$ = this._itemsService.getAllItems().subscribe((data) => {
      console.log(" items: ", data);
      this.allItems = data;
      this.items = [...this.allItems];
      this.filterItems();
    });
  }

  ngOnInit() { }

  onItemsTypeChange(event) {
    this.itemsType = event.detail.value;
    console.log(this.itemsType);
    this.filterItems();
  }

  onSearchInput(event: any) {
    this.searchTerm = event.detail.value;
    console.log(this.searchTerm);
    this.filterItems();
  }

  calculatePendingTime(item) {
    if (item.isActive) {
      const expectedReturnDate = new Date(item.expectedReturnDate);
      return this._itemsService.calculatePendingTime(expectedReturnDate);
    } else {
      return "inactive";
    }
  }

  filterItems() {
    if (!this.allItems || (this.allItems && this.allItems.length <= 0)) {
      return;
    }
    
    this.searching = true;
    this.items = this.allItems.filter(item => {
      this.searching = false;

      if (item.itemName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
        switch (this.itemsType) {
          case "important":
            if (item.isActive && item.importance === "high") {
              return true;
            } else {
              return false;
            }
          case "overdue":
            if (item.isActive && this.calculatePendingTime(item) === "overdue") {
              return true;
            } else {
              return false;
            }
          case "done":
            if (!item.isActive) {
              return true;
            } else {
              return false;
            }
        }
      } else {
        return false;
      }

    });
  }

  ngAfterViewInit() {
    this.backButtonSubscription$ = this._platform.backButton.subscribe(() => {
      // navigator['app'].exitApp();
      this._confirmExitService.confirmExit();
    });
  }

  ionViewDidEnter() {
  }

  removeItem(item: Item) {
    this._itemsService.remove(item);
  }

  ngOnDestroy() {
    this.backButtonSubscription$.unsubscribe();
    if (this.items$) {
      this.items$.unsubscribe();
      this.items$ = null;
    }
    this.items = null;
  }

}
