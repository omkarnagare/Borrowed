import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AppInfoService } from '../services/app-info.service';
import { SocialNetworksService } from '../services/social-networks.service';
import { PlatformInfoService } from '../services/platform-info.service';
import { Subscription } from 'rxjs';
import { Platform, ModalController } from '@ionic/angular';
import { PinUnlockPage } from '../pin-unlock/pin-unlock.page';
import { PinModalData } from '../types';
import { PIN_STATE, BorrowedAppConstants } from '../constants';
import { UsersService } from '../services/users.service';
import { ToastManagerService } from '../services/toast-manager.service';
import { LoaderManagerService } from '../services/loader-manager.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, AfterViewInit, OnDestroy {

  backButtonSubscription$: Subscription;

  isMobilePlatform: boolean = false;
  appInfo: string;

  appVersion: string;

  constructor(
    private _modalController: ModalController,
    private _loader: LoaderManagerService,
    private _toastManager: ToastManagerService,
    private _userService: UsersService,
    private _platform: Platform,
    private _socialNetworkService: SocialNetworksService,
    private _appInfoService: AppInfoService,
    private _platformInfoService: PlatformInfoService
  ) {
    this.isMobilePlatform = this._platformInfoService.isMobilePlatform();
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
  }

  ionViewDidEnter() {
    this.appVersion = this._appInfoService.getAppVersion();
  }

  share() {
    console.log(this._appInfoService.getAppName() + ": v" + this.appVersion);
    this._socialNetworkService.share({
      message: "Hello there!! I am using Borrowed to help me Un-Forget. It's simply amazing and very easy to use. To install, click on the link below",
      subject: this._appInfoService.getAppDetails(),
      // file: "",
      url: this.getAppURL()
    });
  }

  getAppURL(): string {
    if (this._platformInfoService.isMobilePlatform()) {
      if (this._platformInfoService.isAndroidDevice()) {
        return "https://play.google.com/store/apps/details?id=com.nagare.balkrishna.omkar.borrowed";
      } else if (this._platformInfoService.isIOSDevice()) {
        return "https://borrowed-o20121991.firebaseapp.com/";
      }
    }
    return null;
  }

  async openPinModal() {
    const pinModalData: PinModalData = {
      title: "Enter PIN",
      expectedPIN: "",
      pinSetupState: PIN_STATE.SET_PIN
    };
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
        console.log(pinModalData.pin);
        this._loader.presentLoader().then(() => {
          this._userService.setPIN(pinModalData.pin).then((data) => {
            this._toastManager.showToast("PIN set successfully");
          }).finally(() => {
            this._loader.stopLoader();
          });
        });
        break;
      case PIN_STATE.CHANGE_PIN:
        this._userService.setPIN(pinModalData.pin).then((data) => {
          this._toastManager.showToast("PIN changed successfully");
        })
        break;
      case PIN_STATE.VERIFY_PIN:
        // no need in settings page
        break;
    }
  }
}
