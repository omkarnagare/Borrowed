import { Component, OnInit } from '@angular/core';
import { AppInfoService } from '../services/app-info.service';
import { AuthenticationService } from '../services/authentication.service';
import { SocialNetworksService } from '../services/social-networks.service';
import { BorrowedAppConstants } from '../constants';
import { Storage } from '@ionic/storage';
import { PlatformInfoService } from '../services/platform-info.service';
import { AlertController } from '@ionic/angular';
import { ItemsService } from '../services/items.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  isMobilePlatform: boolean = false;
  canViewTransactionCompleteItems: boolean = false;

  constructor(
    private _socialNetworkService: SocialNetworksService,
    private _appInfoService: AppInfoService,
    private _platformInfoService: PlatformInfoService,
    private _authenticationService: AuthenticationService,
    private _itemsService: ItemsService,
    private _alertController: AlertController,
    private _storage: Storage
  ) {
    this.isMobilePlatform = this._platformInfoService.isMobilePlatform();
    this._storage.get(BorrowedAppConstants.VIEW_TRANSACTION_COMPLETE_ITEMS).then(canViewTransactionCompleteItems => {
      if (canViewTransactionCompleteItems !== null || canViewTransactionCompleteItems !== undefined) {
        this.canViewTransactionCompleteItems = canViewTransactionCompleteItems;
        this._itemsService.setCanViewTransactionCompleteItems(this.canViewTransactionCompleteItems);
      }
      console.log("canViewTransactionCompleteItems", this.canViewTransactionCompleteItems)
    }).catch(error => {
      console.log("canViewTransactionCompleteItems", error);
    });
  }

  ngOnInit() {
  }

  toggleViewTransactionCompleteItemsSetting() {
    this._storage.set(BorrowedAppConstants.VIEW_TRANSACTION_COMPLETE_ITEMS, !this.canViewTransactionCompleteItems).then(() => {
      this.canViewTransactionCompleteItems = !this.canViewTransactionCompleteItems;
      this._itemsService.setCanViewTransactionCompleteItems(this.canViewTransactionCompleteItems);
      // const message = this.canViewTransactionCompleteItems ? "Enabled viewing transaction-complete items": "Disabled viewing transaction-complete items";
      // this._itemsService.showToast(message, 4000);
    });
  }

  share() {
    console.log(this._appInfoService.getAppName() + ": v" + this._appInfoService.getAppVersion());
    this._socialNetworkService.share({
      message: "Hello there!! I am using Borrowed to help me Un-Forget. It's simply amazing and very easy to use. To install, click on the link below",
      subject: this._appInfoService.getAppName() + ": v" + this._appInfoService.getAppVersion(),
      // file: "",
      url: "https://github.com/omkarnagare/Borrowed"
    });
  }

  async confirmLogOut() {
    const alert = await  this._alertController.create({
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
      this._authenticationService.showToast(error);
    });
  }

}
