import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { BorrowedAppConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AppInfoService {

  appName: string = BorrowedAppConstants.APP_NAME;
  appVersion: string = BorrowedAppConstants.APP_VERSION;
  packageName: string;
  versionCode: string;

  constructor(
    private _appVersion: AppVersion
  ) { 
    //TODO: uncomment in production
    // this.getAppInfo();
  }

  getAppInfo() {
    this._appVersion.getAppName().then(data => {
      this.appName = data;
    }).catch(error => {
      console.error("AppInfoService: ", error);
    });

    this._appVersion.getPackageName().then(data => {
      this.packageName = data;
    }).catch(error => {
      console.error("AppInfoService: ", error);
    });

    this._appVersion.getVersionCode().then(data => {
      this.versionCode = String(data);
    }).catch(error => {
      console.error("AppInfoService: ", error);
    });

    this._appVersion.getVersionNumber().then(data => {
      this.appVersion = data;
    }).catch(error => {
      console.error("AppInfoService: ", error);
    });
  }

  getAppName(): string {
    return this.appName;
  }

  getAppVersion(): string {
    return this.appVersion
  }
}
