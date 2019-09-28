import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';
import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { PinVerificationService } from '../services/pin-verification.service';
import { PIN_STATE } from '../constants';
import { PinUnlockPage } from '../pin-unlock/pin-unlock.page';
import { ConfirmExitService } from '../services/confirm-exit.service';

import { trigger, state, transition, style, animate } from '@angular/animations';

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

  searching: boolean;

  constructor(
    private _splashScreen: SplashScreen,
    private _platform: Platform,
    private _itemsService: ItemsService,
    private _pinVerification: PinVerificationService,
    private _confirmExitService: ConfirmExitService,
    private _modalController: ModalController
  ) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.items$ = this._itemsService.getAllItems().subscribe(items => {
      this.allItems = items;
      this.items = [... this.allItems];
      console.log(this.items)
      this.filterItems();
    });
    this._pinVerification.isVerified().then((data) => {
      if (data.verified) {
        // safe to go ahead
      } else {
        this.openPinVerifyModal(data.pin);
      }
      this._splashScreen.hide();
    });
  }

  async openPinVerifyModal(expectedPIN: string = "") {
    console.log(expectedPIN);
    const pinModal = await this._modalController.create({
      component: PinUnlockPage,
      componentProps: {
        title: "Enter PIN",
        pinSetupState: PIN_STATE.VERIFY_PIN,
        expectedPIN: expectedPIN
      },
      backdropDismiss: false // user cannot dissmiss by clicking outside
    });
    pinModal.onDidDismiss()
      .then((data) => {
        this._pinVerification.verified = true;
      });
    return await pinModal.present();
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
    if (this.allItems) {
      this.filterItems();
    }
  }

  calculatePendingTime(date: string, item: any) {
    const expectedReturnDate = new Date(date);
    item["status"] = this._itemsService.calculatePendingTime(expectedReturnDate);
    return item["status"];
  }

  filterItems() {
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
