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

  showBannerAd() {
    if (this._platformInfoService.isAndroidDevice()) {
      this._admob.createBanner(environment.bannerAdConfig).then((success) => {
        console.log(success);
        this._admob.showBanner(this._admob.AD_POSITION.BOTTOM_CENTER);
      }).catch(error => {
        console.error(error);
      });
    }
  }

  unhideBanner() {
    this._admob.showBanner(this._admob.AD_POSITION.BOTTOM_CENTER);
  }

  hideBanner() {
    this._admob.hideBanner();
  }
  
  // setUpInterstitialAd() {
  //   if (!this.adDissmissed$) {
  //     this.showInterStitialAd();
  //     this.adDissmissed$ = this._admob.onAdDismiss().subscribe((data) => {
  //       setTimeout(()=> {
  //         this.showInterStitialAd();
  //       }, BorrowedAppConstants.INTERSTITIAL_AD_TIMEOUT);
  //     });
  //   }
  // }

  showInterStitialAd() {
    // TODO: removing full screen ad till I get a strong user base
    
    // if (this._platformInfoService.isAndroidDevice()) {
    //   this._admob.prepareInterstitial(environment.interstitialAdConfig).then((success) => {
    //     console.log(success);
    //     this._admob.showInterstitial();
    //   }).catch(error => {
    //     console.error(error);
    //   });
    // }
  }

  removeBanner() {
    this._admob.removeBanner();
  }

  ngOnDestroy() {
    if (this._platformInfoService.isAndroidDevice()) {
      this._admob.removeBanner();
      if (this.adDissmissed$) {
        this.adDissmissed$.unsubscribe();
        this.adDissmissed$ = null;
      }
    }
  }
}
