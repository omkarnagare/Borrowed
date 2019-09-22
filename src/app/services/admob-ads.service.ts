import { Injectable, OnDestroy } from '@angular/core';
import { AdMobPro } from '@ionic-native/admob-pro/ngx';
import { environment } from 'src/environments/environment';
import { PlatformInfoService } from './platform-info.service';
import { Subscription } from 'rxjs';
import { BorrowedAppConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AdmobAdsService implements OnDestroy {

  adDissmissed$: Subscription;

  constructor(
    private _admob: AdMobPro,
    private _platformInfoService: PlatformInfoService
  ) {
  }

  // showBannerAd() {
  //   if (this._platformInfoService.isAndroidDevice()) {
  //     this._admob.createBanner(environment.bannerAdConfig).then((success) => {
  //       console.log(success);
  //       this._admob.showBanner(this._admob.AD_POSITION.BOTTOM_CENTER);
  //     }).catch(error => {
  //       console.error(error);
  //     });
  //   }
  // }

  // unhideBanner() {
  //   if (this._platformInfoService.isAndroidDevice()) {
  //     this._admob.showBanner(this._admob.AD_POSITION.BOTTOM_CENTER);
  //   }
  // }

  // hideBanner() {
  //   if (this._platformInfoService.isAndroidDevice()) {
  //     this._admob.hideBanner();
  //   }
  // }

  showInterStitialAd() {
    if (this._platformInfoService.isAndroidDevice()) {
      this._admob.prepareInterstitial(environment.interstitialAdConfig).then((success) => {
        console.log(success);
        this._admob.showInterstitial();
      }).catch(error => {
        console.error(error);
      });
    }
  }

  // removeBanner() {
  //   if (this._platformInfoService.isAndroidDevice()) {
  //     this._admob.removeBanner();
  //   }
  // }

  ngOnDestroy() {
    if (this._platformInfoService.isAndroidDevice()) {
      if (this.adDissmissed$) {
        this.adDissmissed$.unsubscribe();
        this.adDissmissed$ = null;
      }
    }
  }
}
