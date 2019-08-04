import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

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
}
