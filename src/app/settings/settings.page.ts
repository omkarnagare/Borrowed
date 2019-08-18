import { Component, OnInit } from '@angular/core';
import { AppInfoService } from '../services/app-info.service';
import { AuthenticationService } from '../services/authentication.service';
import { SocialNetworksService } from '../services/social-networks.service';
import { Router } from '@angular/router';
import { BorrowedAppConstants } from '../constants';
import { ThemingService } from '../services/theming.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  themes: any;

  constructor(
    private _socialNetworkService: SocialNetworksService,
    private _appInfoService: AppInfoService,
    private _themingService: ThemingService
  ) {

    // this.themes = [];
    const themes = [];
    Object.keys(BorrowedAppConstants.THEMES).forEach(function (key) {
      themes.push({
        name: key,
        color: BorrowedAppConstants.THEMES[key]["primary"]
      });
    });

    this.themes = [...themes];
  }

  ngOnInit() {
  }

  setTheme(name) {
    this._themingService.setTheme(name);
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

}
