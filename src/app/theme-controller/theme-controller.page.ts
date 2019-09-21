import { Component, OnInit } from '@angular/core';
import { ThemingService } from '../services/theming.service';
import { BorrowedAppConstants } from '../constants';
import { AdmobAdsService } from '../services/admob-ads.service';
import { LoaderManagerService } from '../services/loader-manager.service';

import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-theme-controller',
  templateUrl: './theme-controller.page.html',
  styleUrls: ['./theme-controller.page.scss'],
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
export class ThemeControllerPage implements OnInit {

  themes: any = [];

  showThemeSelection: boolean = false;

  constructor(
    private _themingService: ThemingService,
    private _loader: LoaderManagerService,
    private _admobServices: AdmobAdsService
  ) {
    this.themes = this.processThemes();
  }

  ionViewDidEnter() {
    this.showThemeSelection = true;
    this._admobServices.showInterStitialAd();
  }

  ionViewWillLeave() {
    this.showThemeSelection = false;
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
