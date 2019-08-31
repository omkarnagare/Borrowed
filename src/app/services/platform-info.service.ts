import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PlatformInfoService {

  constructor(
    private _platform: Platform
  ) { }

  isMobilePlatform(): boolean {
    console.log('platforms supported: ',this._platform.platforms());
    return !(this._platform.is('electron')
      || this._platform.is('pwa')
      || this._platform.is('mobileweb')
      || this._platform.is('desktop')
      || this._platform.is('capacitor'));
  }

  isAndroidDevice(): boolean {
    return this._platform.is('android');
  }

  isIOSDevice(): boolean {
    return this._platform.is('ios');
  }

}
