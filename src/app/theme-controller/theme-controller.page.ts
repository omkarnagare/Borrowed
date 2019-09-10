import { Component, OnInit } from '@angular/core';
import { ThemingService } from '../services/theming.service';
import { BorrowedAppConstants } from '../constants';
import { AdmobAdsService } from '../services/admob-ads.service';
import { LoaderManagerService } from '../services/loader-manager.service';

@Component({
  selector: 'app-theme-controller',
  templateUrl: './theme-controller.page.html',
  styleUrls: ['./theme-controller.page.scss'],
})
export class ThemeControllerPage implements OnInit {

  themes: any = [];

  constructor(
    private _themingService: ThemingService,
    private _loader: LoaderManagerService,
    private _admobServices: AdmobAdsService
  ) {
    this.themes = this.processThemes();
  }

  ionViewDidEnter() {
    this._admobServices.showInterStitialAd();
  }

  processThemes() {
    const themes = [];
    Object.keys(BorrowedAppConstants.THEMES).forEach(function (key) {
      themes.push({
        name: key,
        color: BorrowedAppConstants.THEMES[key]["primary"]
      });
    });
    return [...themes];
  }

  setTheme(name) {
    this._loader.presentLoader().then(() => {
      this._themingService.setTheme(name);
      this._loader.stopLoader();
    });
  }

  ngOnInit() {
  }

}
