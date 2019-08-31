import { Component, OnInit } from '@angular/core';
import { AppInfoService } from '../services/app-info.service';
import { SocialNetworksService } from '../services/social-networks.service';
import { PlatformInfoService } from '../services/platform-info.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  isMobilePlatform: boolean = false;
  appInfo: string;

  constructor(
    private _socialNetworkService: SocialNetworksService,
    private _appInfoService: AppInfoService,
    private _platformInfoService: PlatformInfoService
  ) {
    this.isMobilePlatform = this._platformInfoService.isMobilePlatform();
  }

  ngOnInit() {
  }

  share() {
    console.log(this._appInfoService.getAppName() + ": v" + this._appInfoService.getAppVersion());
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

}
