import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';
import { Platform, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AdmobAdsService } from '../services/admob-ads.service';
import { LoaderManagerService } from '../services/loader-manager.service';
import { ToastManagerService } from '../services/toast-manager.service';
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
export class BorrowedPage implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription$: Subscription;

  lentItems: Observable<Item[]>;
  lentItems$: Subscription;

  searchFromGroup: FormGroup;
  searching: boolean;
  enableSearchBar: boolean;

  adEnabled: boolean = false;

  constructor(
    private _splashScreen: SplashScreen,
    private _platform: Platform,
    private _itemsService: ItemsService,
    private _loader: LoaderManagerService,
    private _toastManager: ToastManagerService,
    private _admobService: AdmobAdsService,
    private _pinVerification: PinVerificationService,
    private _confirmExitService: ConfirmExitService,
    private _modalController: ModalController,
    formBuilder: FormBuilder
  ) {
    this.searchFromGroup = formBuilder.group({
      searchControl: ""
    });
    this.searching = true;
    this.enableSearchBar = false;

    this.searchFromGroup.get("searchControl").valueChanges
      .pipe(debounceTime(700))
      .subscribe(search => {
        this.setFilteredItems(search);
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
      this.searching = true;
      this.searchFromGroup.get("searchControl").setValue("");
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
    this.lentItems$.unsubscribe();
    this.lentItems$ = null;
    this.lentItems = null;
  }

  setFilteredItems(searchTerm: string) {
    this.lentItems = this._itemsService.getActiveItems().pipe(
      map((data) => {
        this.searching = false;
        if (!this.adEnabled) {
          this._admobService.showBannerAd();
          this.adEnabled = true;
        }
        return data.filter(item => {
          return item.itemName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
      })
    );
    this.lentItems$ = this.lentItems.subscribe(data => {
      console.log(data);
    });
  }

  onSearchInput() {
    this.searching = true;
  }

  removeItem(item: Item) {
    this._itemsService.remove(item);
  }

  toggleUrgentStatus(id: string, lentItem: Item) {
    this._loader.presentLoader().then(() => {
      lentItem.isUrgent = !lentItem.isUrgent;
      this._itemsService.updateItem(id, lentItem).then((result) => {
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

  toggleFiltering() {
    this.enableSearchBar = !this.enableSearchBar;
    if (!this.enableSearchBar) {
      this.searching = true;
      this.searchFromGroup.get("searchControl").setValue("");
    }
  }

}
