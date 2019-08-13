import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { WhatsAppAttributes, EmailAttributes } from '../types';

@Injectable({
  providedIn: 'root'
})
export class SocialNetworksService {

  constructor(
    private _socialSharing: SocialSharing
  ) { }

  shareToSocialNetworks(data: any) {
    this._socialSharing.share(
      "I found this on Borrowed.",
      "",
      "",
      "https://github.com/omkarnagare"
    );
  }

  shareToWhatsApp(attr: WhatsAppAttributes) {
    this._socialSharing.shareViaWhatsApp(
      attr.message,
      attr.image,
      attr.url
    );
  }

  sendEmail(attr: EmailAttributes) {
    this._socialSharing.shareViaEmail(
      attr.message,
      attr.subject,
      attr.to,
      attr.cc,
      attr.bcc,
      attr.files
    );
  }
}
