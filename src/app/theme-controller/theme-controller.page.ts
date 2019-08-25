import { Component, OnInit } from '@angular/core';
import { ThemingService } from '../services/theming.service';
import { BorrowedAppConstants } from '../constants';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-theme-controller',
  templateUrl: './theme-controller.page.html',
  styleUrls: ['./theme-controller.page.scss'],
})
export class ThemeControllerPage implements OnInit {

  themes: any = [];
  loader: any = null;

  constructor(
    private _themingService: ThemingService,
    private _loadingController: LoadingController
  ) {
    this.themes = this.processThemes();
  }

  async presentLoader() {
    if (!this.loader) {
      this.loader = await this._loadingController.create({
        message: 'Changing Theme ...'
      });
      await this.loader.present();
    }
  }

  async stopLoader() {
    if (this.loader) {
      await this.loader.dismiss();
      this.loader = null;
    }
  }

  processThemes() {
    const themes = [];
    Object.keys(BorrowedAppConstants.THEMES).forEach(function (key) {
      themes.push({
        name: key,
        color: BorrowedAppConstants.THEMES[key]["primary"]
      });
    });
    return [...themes];
  }

  setTheme(name) {
    this.presentLoader().then(() => {
      this._themingService.setTheme(name);
      this.stopLoader();
    });
  }

  ngOnInit() {
  }

}
