import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';
import { Platform, ModalController, PopoverController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { PinVerificationService } from '../services/pin-verification.service';
import { PIN_STATE } from '../constants';
import { PinUnlockPage } from '../pin-unlock/pin-unlock.page';
import { ConfirmExitService } from '../services/confirm-exit.service';

import { trigger, state, transition, style, animate } from '@angular/animations';
import { SortItemsComponent } from '../sort-items/sort-items.component';
import { LocalNotificationsManagerService } from '../services/local-notifications-manager.service';

@Component({
  selector: 'app-borrowed',
  templateUrl: 'borrowed.page.html',
  styleUrls: ['borrowed.page.scss'],
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
export class BorrowedPage implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription$: Subscription;

  allItems: any = null;
  items: any = null;
  items$: Subscription;

  itemsType: string = null;
  searchTerm: string = "";
  sortBy: string = null;

  searching: boolean;

  constructor(
    private _splashScreen: SplashScreen,
    private _platform: Platform,
    private _itemsService: ItemsService,
    private _pinVerification: PinVerificationService,
    private _confirmExitService: ConfirmExitService,
    private _modalController: ModalController,
    private _popOverController: PopoverController,
    private _localNotificationsManager: LocalNotificationsManagerService
  ) {
    this.items$ = this._itemsService.getAllItems().subscribe(items => {
      this.allItems = items;
      this.items = [... this.allItems];
      console.log(this.items)
      this.filterItems();

      this._localNotificationsManager.handleLocalNotifications(this.allItems);
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this._pinVerification.isVerified().then((data) => {
      if (data.verified) {
        // safe to go ahead
      } else {
        this.openPinVerifyModal(data.pin);
      }
      this._splashScreen.hide();
    });
  }

  async selectSortField(event: any) {
    const popover = await this._popOverController.create({
      component: SortItemsComponent,
      event: event,
      animated: true,
      showBackdrop: true,
      componentProps: {
        icon: this.sortBy
      },
      cssClass: "sort-items"
    });
    popover.onDidDismiss().then(response => {
      if (response.data && this.sortBy !== response.data.icon) {
        this.sortBy = response.data.icon;
        this.filterItems();
      }
    })
    return await popover.present();
  }

  async openPinVerifyModal(expectedPIN: string = "") {
    console.log(expectedPIN);
    const pinModalOfHome = await this._modalController.create({
      component: PinUnlockPage,
      componentProps: {
        title: "Enter PIN",
        pinSetupState: PIN_STATE.VERIFY_PIN,
        expectedPIN: expectedPIN
      },
      backdropDismiss: false // user cannot dissmiss by clicking outside
    });
    pinModalOfHome.onDidDismiss()
      .then((data) => {
        this._pinVerification.verified = true;
      });
    return await pinModalOfHome.present();
  }

  ngAfterViewInit() {
    this.backButtonSubscription$ = this._platform.backButton.subscribe(() => {
      // navigator['app'].exitApp();
      this._confirmExitService.confirmExit();
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription$.unsubscribe();
    if (this.items$) {
      this.items$.unsubscribe();
      this.items$ = null;
    }
    this.items = null;
  }

  onItemsTypeChange(event) {
    this.itemsType = event.detail.value;
    console.log(this.itemsType);
    this.filterItems();
  }

  calculatePendingTime(date: string, item: any) {
    const expectedReturnDate = new Date(date);
    item["status"] = this._itemsService.calculatePendingTime(expectedReturnDate);
    return item["status"];
  }

  filterItems() {
    if (!this.allItems || (this.allItems && this.allItems.length <= 0)) {
      return;
    }

    this.searching = true;
    this.items = this.allItems.filter(item => {
      this.searching = false;

      if (item.isActive && item.itemName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
        switch (this.itemsType) {
          case "all":
            return true;
          default:
            if (item.transactionType === this.itemsType) {
              return true;
            } else {
              return false;
            }
        }
      } else {
        return false;
      }

    });
    if (this.sortBy) {
      this.sortItems();
    }
  }

  sortItems() {
    this.items.sort((item1: Item, item2: Item) => {
      switch (this.sortBy) {
        case "cube":
          if (item1.itemName > item2.itemName) {
            return 1;
          }
          if (item1.itemName < item2.itemName) {
            return -1;
          }
          return 0;
        case "time":
          return new Date(item2.eventDate).getTime() - new Date(item1.eventDate).getTime();
        case "hourglass":
          if (item1.isActive) {
            return new Date(item2.expectedReturnDate).getTime() - new Date(item1.expectedReturnDate).getTime();
          } else {
            return new Date(item2.returnDate).getTime() - new Date(item1.returnDate).getTime();
          }
        case "person":
          if (item1.personName > item2.personName) {
            return 1;
          }
          if (item1.personName < item2.personName) {
            return -1;
          }
          return 0;
      }
    });
  }

  onSearchInput(event: any) {
    this.searchTerm = event.detail.value;
    console.log(this.searchTerm);
    this.filterItems();
  }

  removeItem(item: Item) {
    this._itemsService.remove(item);
  }

}
