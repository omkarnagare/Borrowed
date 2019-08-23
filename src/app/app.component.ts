import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ThemingService } from './services/theming.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  showSplashAnimation:boolean = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _themingService: ThemingService // this is needed to set the theme via constructor
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      setTimeout(()=> {
        this.showSplashAnimation = false;
      }, 3000);
      // no need to check for internet connection as data persistence is enabled
      // this._networkService.initializeNetworkEvents();
    });
  }
}
