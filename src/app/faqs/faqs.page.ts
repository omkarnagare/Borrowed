import { Component, OnInit } from '@angular/core';
import { BorrowedAppConstants } from '../constants';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { PlatformInfoService } from '../services/platform-info.service';
import { AdmobAdsService } from '../services/admob-ads.service';
import { ToastManagerService } from '../services/toast-manager.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FAQsPage implements OnInit {

  googlePayId: string;
  isMobilePlatform: boolean = false;

  constructor(
    private _clipboard: Clipboard,
    private _toastManager: ToastManagerService,
    private _platformInfoService: PlatformInfoService,
    private _admobService: AdmobAdsService
  ) { 
    this.isMobilePlatform = this._platformInfoService.isMobilePlatform();
    this.googlePayId = BorrowedAppConstants.GOOGLE_PAY_ID;
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this._admobService.showInterStitialAd();
  }

  copyToClipboard() {
    this._clipboard.copy(this.googlePayId).then(() => {
      this._toastManager.showToast("Google pay Id copied to clipboard.")
    }).catch((error) => {
      console.error(error);
      this._toastManager.showErrorToast(error);
    })
  }

}
