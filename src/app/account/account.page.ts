import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UsersService } from '../services/users.service';
import { GetImageService } from '../services/get-image.service';
import { ImageSourceType, BorrowedAppConstants } from '../constants';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';
import { ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { PlatformInfoService } from '../services/platform-info.service';
import { ToastManagerService } from '../services/toast-manager.service';
import { AdmobAdsService } from '../services/admob-ads.service';

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
    private _getImageService: GetImageService,
    private _itemsService: ItemsService,
    private _toastManager: ToastManagerService,
    private _platformInfoService: PlatformInfoService,
    private _authenticationService: AuthenticationService,
    private _alertController: AlertController,
    private _actionSheetController: ActionSheetController
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

}
