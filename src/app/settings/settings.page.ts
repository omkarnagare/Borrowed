import { Component, OnInit } from '@angular/core';
import { AppInfoService } from '../services/app-info.service';
import { AuthenticationService } from '../services/authentication.service';
import { SocialNetworksService } from '../services/social-networks.service';
import { Router } from '@angular/router';
import { BorrowedAppConstants } from '../constants';
import { ThemingService } from '../services/theming.service';
import { PlatformInfoService } from '../services/platform-info.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  isMobilePlatform: boolean = false;

  constructor(
    private _socialNetworkService: SocialNetworksService,
    private _appInfoService: AppInfoService,
    private _platformInfoService: PlatformInfoService,
    private _authenticationService: AuthenticationService,
    private _alertController: AlertController
  ) {
    this.isMobilePlatform = this._platformInfoService.isMobilePlatform();
  }

  ngOnInit() {
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
