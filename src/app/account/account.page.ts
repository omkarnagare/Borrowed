import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UsersService } from '../services/users.service';
import { GetImageService } from '../services/get-image.service';
import { ImageSourceType, BorrowedAppConstants, PIN_STATE } from '../constants';
import { Item, PinModalData } from '../types';
import { ItemsService } from '../services/items.service';
import { ActionSheetController, AlertController, Platform, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { PlatformInfoService } from '../services/platform-info.service';
import { ToastManagerService } from '../services/toast-manager.service';
import { AdmobAdsService } from '../services/admob-ads.service';
import { PinUnlockPage } from '../pin-unlock/pin-unlock.page';
import { LoaderManagerService } from '../services/loader-manager.service';
import { PinVerificationService } from '../services/pin-verification.service';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss']
})
export class AccountPage implements OnInit, AfterViewInit, OnDestroy {

  backButtonSubscription$: Subscription;

  storedUserProfile: Observable<any>;
  lentItems: Observable<Item[]>;
  urgentLentItems: Observable<Item[]>;
  transactionCompleteItems: Observable<Item[]>;

  storedUserProfile$: Subscription;
  lentItems$: Subscription;
  urgentLentItems$: Subscription;
  transactionCompleteItems$: Subscription;

  isMobilePlatform: boolean = false;

  constructor(
    private _platform: Platform,
    private _admobService: AdmobAdsService,
    private _usersService: UsersService,
    private _pinVerification: PinVerificationService,
    private _getImageService: GetImageService,
    private _itemsService: ItemsService,
    private _toastManager: ToastManagerService,
    private _platformInfoService: PlatformInfoService,
    private _authenticationService: AuthenticationService,
    private _alertController: AlertController,
    private _actionSheetController: ActionSheetController,
    private _modalController: ModalController,
    private _loader: LoaderManagerService
  ) {
    this.isMobilePlatform = this._platformInfoService.isMobilePlatform();

    this.storedUserProfile = _usersService.getUserProfile();
    this.lentItems = this._itemsService.getActiveItems();
    this.urgentLentItems = this._itemsService.getUrgentItems();
    this.transactionCompleteItems = this._itemsService.getTransactionCompleteItems();

    this.storedUserProfile$ = this.storedUserProfile.subscribe(data => {
      console.log("storedUserProfile", data);
    });
    this.lentItems$ = this.lentItems.subscribe(data => {
      console.log("lentItems", data);
    });
    this.urgentLentItems$ = this.urgentLentItems.subscribe(data => {
      console.log("urgentLentItems", data);
    });
    this.transactionCompleteItems$ = this.transactionCompleteItems.subscribe(data => {
      console.log("transactionCompleteItems", data);
    });
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.backButtonSubscription$ = this._platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription$.unsubscribe();
    this.storedUserProfile$.unsubscribe();
    this.lentItems$.unsubscribe();
    this.urgentLentItems$.unsubscribe();
    this.transactionCompleteItems$.unsubscribe();
    this.storedUserProfile$ = null;
    this.lentItems$ = null;
    this.urgentLentItems$ = null;
    this.transactionCompleteItems$ = null;
    this.storedUserProfile = null;
    this.lentItems = null;
    this.urgentLentItems = null;
    this.transactionCompleteItems = null;
  }

  async selectImageSource() {
    const alert = await this._actionSheetController.create({
      buttons: [
        {
          text: "Camera",
          icon: 'camera',
          handler: () => {
            this.getProfileImage(ImageSourceType.FRONT_CAMERA);
          }
        },
        {
          text: "Gallery",
          icon: 'images',
          handler: () => {
            this.getProfileImage(ImageSourceType.GALLERY);
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await alert.present();
  }

  getProfileImage(sourceType: ImageSourceType) {
    this._getImageService.getImage(sourceType)
      .then((imageData) => {
        // console.log(imageData);
        this._usersService.setUserProfileImage(imageData).then(data => {
          this._toastManager.showToast(BorrowedAppConstants.USER_IMAGE_SUCCESS_MESSAGE);
        }).catch(error => {
          this._toastManager.showToast(BorrowedAppConstants.ERROR_MESSAGE);
        });
      },
        (error) => {
          console.log("error occurred while getting Profile Image: ", error);
        });
  }

  async confirmLogOut() {
    const alert = await this._alertController.create({
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.logOut();
          }
        }
      ]
    });
    await alert.present();
  }

  logOut() {
    this._admobService.removeBanner();
    this._authenticationService.logOut().then(() => {
      // this._router.navigate(['']);
      console.log("User logged out successfully");
      window.location.reload();
    }).catch((error) => {
      console.log("Log Out Error :", error);
      this._toastManager.showErrorToast(error);
    });
  }

  async openPinModal(pinSetupState: PIN_STATE, expectedPIN: string = "") {
    let pinModalData: PinModalData;
    switch (pinSetupState) {
      case PIN_STATE.SET_PIN:
      case PIN_STATE.VERIFY_PIN:
        pinModalData = {
          title: "Enter PIN",
        };
        break;
      case PIN_STATE.CHANGE_PIN:
      case PIN_STATE.REMOVE_PIN:
        pinModalData = {
          title: "Verify PIN",
        };
        break;
    }
    pinModalData.pinSetupState = pinSetupState;
    pinModalData.expectedPIN = expectedPIN;

    const pinModal = await this._modalController.create({
      component: PinUnlockPage,
      componentProps: pinModalData,
    });

    pinModal.onDidDismiss()
      .then((data) => {
        const response = data.data;
        if (response) {
          const pinModalData: PinModalData = {};
          if (response[BorrowedAppConstants.PIN_KEY]) {
            pinModalData.pin = response[BorrowedAppConstants.PIN_KEY];
          }
          if (response[BorrowedAppConstants.PIN_VERIFIED_KEY]) {
            pinModalData.verified = response[BorrowedAppConstants.PIN_VERIFIED_KEY];
          }
          if (response[BorrowedAppConstants.PIN_SET_UP_STATE_KEY]) {
            pinModalData.pinSetupState = response[BorrowedAppConstants.PIN_SET_UP_STATE_KEY];
          }
          this.processPinModalData(pinModalData);
        } else {
          // no need to take any action
        }
      });

    return await pinModal.present();
  }

  processPinModalData(pinModalData: PinModalData) {
    switch (pinModalData.pinSetupState) {
      case PIN_STATE.SET_PIN:
      case PIN_STATE.CHANGE_PIN:
        console.log(pinModalData.pin);
        this.setPin(pinModalData.pin);
        break;
      case PIN_STATE.REMOVE_PIN:
        this.removePin();
        break;
      // case PIN_STATE.VERIFY_PIN:
      //   break;
    }
  }

  async confirmPinAction(pinSetupState: PIN_STATE, expectedPIN: string = "") {
    let message: string;
    switch (pinSetupState) {
      case PIN_STATE.SET_PIN:
        message = 'This will set up a PIN for your account. Once set, You won\'t be able to access your data without valid PIN. Do you want to continue ?';
        break;
      // case PIN_STATE.VERIFY_PIN:
      //   message = "";
      //   break;
      case PIN_STATE.CHANGE_PIN:
        message = 'This will change the PIN for your account. Do you want to continue ?';
        break;
      case PIN_STATE.REMOVE_PIN:
        message = 'Are you sure you want remove the PIN. This will leave your data unsupervised ?';
        break;
    }
    const alert = await this._alertController.create({
      message: message,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.openPinModal(pinSetupState, expectedPIN);
          }
        }
      ]
    });
    await alert.present();
  }

  setPin(pin: string) {
    this._loader.presentLoader().then(() => {
      this._usersService.setPIN(pin).then((data) => {
        // this._toastManager.showToast("PIN set successfully");
        this._pinVerification.pin = pin;
        this._pinVerification.verified = false;
      }).finally(() => {
        this._loader.stopLoader();
      });
    });
  }

  removePin() {
    this._loader.presentLoader().then(() => {
      this._usersService.removePIN().then((data) => {
        // this._toastManager.showToast("PIN removed successfully");
        this._pinVerification.verified = true;
      }).finally(() => {
        this._loader.stopLoader();
      });
    });
  }

}
