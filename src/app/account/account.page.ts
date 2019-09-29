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
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ConfirmExitService } from '../services/confirm-exit.service';

import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
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
export class AccountPage implements OnInit, AfterViewInit, OnDestroy {

  backButtonSubscription$: Subscription;
  showAccountDetails: boolean = false;

  userProfile: any = null;
  allItems: Item[] = null;
  userProfile$: Subscription;
  allItems$: Subscription;

  lentItemsCount: number = 0;
  borrowedItemsCount: number = 0;
  doneItemsCount: number = 0;

  isMobilePlatform: boolean = false;

  userInfoFormGroup: FormGroup;
  validationMessages: any
  editingName: boolean = false;

  constructor(
    private _platform: Platform,
    private _usersService: UsersService,
    private _pinVerification: PinVerificationService,
    private _getImageService: GetImageService,
    private _itemsService: ItemsService,
    private _toastManager: ToastManagerService,
    private _platformInfoService: PlatformInfoService,
    private _confirmExitService: ConfirmExitService,
    private _authenticationService: AuthenticationService,
    private _alertController: AlertController,
    private _actionSheetController: ActionSheetController,
    private _modalController: ModalController,
    private _loader: LoaderManagerService,
    formBuilder: FormBuilder
  ) {

    this.userInfoFormGroup = formBuilder.group({
      name: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")]]
    });

    this.validationMessages = {
      'name': [
        { type: 'required', message: 'Name cannot be left blank.' },
        { type: 'pattern', message: 'Not a valid name.' }]
    };
  }

  isError(name: string, validationType: string): boolean {
    return this.userInfoFormGroup.get(name).hasError(validationType) && (this.userInfoFormGroup.get(name).dirty || this.userInfoFormGroup.get(name).touched)
  }

  updateUserDisplayName() {
    const displayName = this.userInfoFormGroup.get('name').value;
    this._loader.presentLoader().then(() => {
      this._usersService.updateUserDisplayName(displayName).then(() => {
        this._toastManager.showToast(BorrowedAppConstants.DISPLAY_NAME_UPDATE_SUCCESS_MESSAGE);
        this.userInfoFormGroup.reset();
        this.editingName = false;
      }).catch(error => {
        this._toastManager.showErrorToast(error);
      }).finally(() => {
        this._loader.stopLoader();
      });
    });
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.backButtonSubscription$ = this._platform.backButton.subscribe(() => {
      // navigator['app'].exitApp();
      this._confirmExitService.confirmExit();
    });
  }

  ionViewDidEnter() {
    this.showAccountDetails = true;
    this.setUpServices();
  }

  ionViewWillLeave() {
    this.showAccountDetails = false;
  }

  setUpServices() {
    this.isMobilePlatform = this._platformInfoService.isMobilePlatform();

    this.userProfile$ = this._usersService.getUserProfile().subscribe(data => {
      console.log("userProfile", data);
      this.userProfile = data;
    });
    this.allItems$ = this._itemsService.getAllItems().subscribe(data => {
      console.log("allItems", data);
      this.calculateCounts(data);
      this.allItems = data;
    });
  }

  calculateCounts(items: any) {
    const activeItems = items.filter(item => {
      return item.isActive;
    });
    this.doneItemsCount = items.length - activeItems.length;
    const lentItems = activeItems.filter(item => {
      return item.transactionType === "lent";
    });
    this.lentItemsCount = lentItems.length;
    this.borrowedItemsCount = activeItems.length - this.lentItemsCount;
  }

  ngOnDestroy() {
    this.backButtonSubscription$.unsubscribe();
    this.userProfile$.unsubscribe();
    this.allItems$.unsubscribe();
    this.userProfile$ = null;
    this.allItems$ = null;
    this.userProfile = null;
    this.allItems = null;
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
      header: 'Confirm Log-Out',
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

    const pinModalOfAccount = await this._modalController.create({
      component: PinUnlockPage,
      componentProps: pinModalData,
    });

    pinModalOfAccount.onDidDismiss()
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

    return await pinModalOfAccount.present();
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
    let header: string;
    switch (pinSetupState) {
      case PIN_STATE.SET_PIN:
        header = 'Set 4-digit PIN';
        message = 'This will set up a PIN for your account. Once set, You won\'t be able to access your data without valid PIN. Do you want to continue ?';
        break;
      // case PIN_STATE.VERIFY_PIN:
      //   message = "";
      //   break;
      case PIN_STATE.CHANGE_PIN:
        header = 'Change PIN';
        message = 'This will change the PIN for your account. Do you want to continue ?';
        break;
      case PIN_STATE.REMOVE_PIN:
        header = 'Remove PIN';
        message = 'Are you sure you want remove the PIN. This will leave your data unsupervised ?';
        break;
    }
    const alert = await this._alertController.create({
      header: header,
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
        this._pinVerification.verified = true;
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
