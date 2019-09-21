import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AppInfoService } from '../services/app-info.service';
import { SocialNetworksService } from '../services/social-networks.service';
import { PlatformInfoService } from '../services/platform-info.service';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { ConfirmExitService } from '../services/confirm-exit.service';

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
    private _platform: Platform,
    private _confirmExitService: ConfirmExitService,
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
      // navigator['app'].exitApp();
      this._confirmExitService.confirmExit();
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
}
