import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderManagerService {

  loader: any = null;

  constructor(
    private _loadingController: LoadingController
  ) { }

  async presentLoader( message: string = 'Processing your request ...') {
    if (!this.loader) {
      this.loader = await this._loadingController.create({
        message: message
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
}
