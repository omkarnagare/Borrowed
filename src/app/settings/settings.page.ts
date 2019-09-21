import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AppInfoService } from '../services/app-info.service';
import { SocialNetworksService } from '../services/social-networks.service';
import { PlatformInfoService } from '../services/platform-info.service';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { ConfirmExitService } from '../services/confirm-exit.service';

import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
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
export class SettingsPage implements OnInit, AfterViewInit, OnDestroy {

  backButtonSubscription$: Subscription;
  showSettingsMenu: boolean = false; // required to re-create component for animation

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
    this.showSettingsMenu = true;
  }

  ionViewWillLeave() {
    this.showSettingsMenu = false;
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
