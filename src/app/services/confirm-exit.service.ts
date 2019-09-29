import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PinVerificationService } from './pin-verification.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmExitService {

  alertPresentedAlready: boolean = false;

  constructor(
    private _alertController: AlertController,
    private _pinVerification: PinVerificationService
  ) { }

  async confirmExit() {
    if (!this.alertPresentedAlready) {
      this.alertPresentedAlready = true;
      const alert = await this._alertController.create({
        header: 'Closing Borrowing..',
        message: "This will exit the application. Do you want to continue ?",
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.alertPresentedAlready = false;
            }
          },
          {
            text: 'Exit',
            handler: () => {
              this.alertPresentedAlready = false;
              navigator['app'].exitApp();
            }
          }]
      });
      await alert.present();
    }
  }
}
