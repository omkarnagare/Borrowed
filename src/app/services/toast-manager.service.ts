import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastManagerService {

  constructor(
    private _toastController: ToastController
  ) { }

  showToast(message: any, duration = 2000) {
    const toast = this._toastController.create({
      message: message,
      duration: duration,
      position: "bottom",
      showCloseButton: true,
      closeButtonText: "Dismiss",
      color: "primary",
      cssClass: "borrowed-toast"
    });
    toast.then((toastMessage) => {
      toastMessage.present();
    });
  }

  showErrorToast(error: any, duration = 2000) {
    console.error(error);
    const toast = this._toastController.create({
      message: error.message ? error.message : error,
      duration: duration,
      position: "bottom",
      showCloseButton: true,
      closeButtonText: "Dismiss",
      color: "danger",
      cssClass: "borrowed-toast"
    });
    toast.then((toastMessage) => {
      toastMessage.present();
    });
  }
}
