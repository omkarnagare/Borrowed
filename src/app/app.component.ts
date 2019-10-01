import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ThemingService } from './services/theming.service';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { PinVerificationService } from './services/pin-verification.service';
import { PushNotificationsManagerService } from './services/push-notifications-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private _themingService: ThemingService, // this is needed to set the theme via constructor
    private _pinVerificationService: PinVerificationService,
    private _pushNotificationsManager: PushNotificationsManagerService,
    private platform: Platform,
    private statusBar: StatusBar,
    private _authenticationService: AuthenticationService,
    private _router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this._pushNotificationsManager.setUpFCM();
      this.statusBar.styleDefault();
      // no need to check for internet connection as data persistence is enabled
      // this._networkService.initializeNetworkEvents();

      this._authenticationService.getAuth().onAuthStateChanged(user => {
        if (user) {
          this._router.navigate(["/tabs"]);
        }
        else {
          this._router.navigate(["/log-in"]);
        }
      });

    });
  }
}
