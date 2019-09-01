import { Component, OnInit } from '@angular/core';
import { BorrowedAppConstants } from '../constants';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ToastController } from '@ionic/angular';
import { PlatformInfoService } from '../services/platform-info.service';

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
    private _toastController: ToastController,
    private _platformInfoService: PlatformInfoService
  ) { 
    this.isMobilePlatform = this._platformInfoService.isMobilePlatform();
    this.googlePayId = BorrowedAppConstants.GOOGLE_PAY_ID;
  }

  ngOnInit() {
  }

  copyToClipboard() {
    this._clipboard.copy(this.googlePayId).then(() => {
      this.showToast("Google pay Id copied to clipboard.")
    }).catch((error) => {
      console.error(error);
      this.showToast(error);
    })
  }

  showToast(message: any, duration = 2000) {
    const toast = this._toastController.create({
      message: message,
      duration: duration,
      position: "bottom",
      showCloseButton: true,
      closeButtonText: "Dismiss",
      color: "primary",
    });
    toast.then((toastMessage) => {
      toastMessage.present();
    });
  }

}
