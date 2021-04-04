import { Component, OnInit } from '@angular/core';
import { BorrowedAppConstants } from '../constants';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { PlatformInfoService } from '../services/platform-info.service';
import { AdmobAdsService } from '../services/admob-ads.service';
import { ToastManagerService } from '../services/toast-manager.service';

import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
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
export class FAQsPage implements OnInit {

  googlePayId: string;
  isMobilePlatform: boolean = false;

  showFAQs: boolean = false;

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
    this.showFAQs = true;
    // this._admobService.showInterStitialAd();
  }

  ionViewWillLeave() {
    this.showFAQs = false;
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
