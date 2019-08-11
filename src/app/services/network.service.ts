import { Injectable, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { BorrowedAppConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class NetworkService implements OnDestroy {

  disconnectSubscription$;
  connectSubscription$

  previousType: any;

  public alertPresented: boolean = false;

  constructor(
    private _alertController: AlertController,
    private _network: Network
  ) {
    setTimeout(() => {
      const networkType = this._network.type ? this._network.type.toLowerCase() : null;
      if (networkType && (networkType === "unknown" || networkType === "none")) {
        console.error("Internet connection is not active.")
        this.presentAlert(BorrowedAppConstants.DEVICE_OFFLINE_MESSAGE);
      } else {
        console.log("Internet connection is active now.");
        this.dissmissAlert();
      }
    }, 3000);
  }

  public async presentAlert(message: string) {
    // if (!this.alertPresented) {
    //   this.alertPresented = true;
    //   const alert = await this._alertController.create({
    //     header: 'Borrowed Exiting ..',
    //     message: message,
    //     buttons: [{
    //       text: 'Exit App',
    //       handler: () => {
    //         this.alertPresented = false;
    //         navigator['app'].exitApp();
    //       }
    //     }]
    //   });
    //   await alert.present();
    // }
  }

  public dissmissAlert() {
    if (this.alertPresented) {
      this._alertController.dismiss();
      this.alertPresented = false;
    }
  }

  public initializeNetworkEvents(): void {
    this.disconnectSubscription$ = this._network.onDisconnect().subscribe(() => {
      console.error("Internet connection is not active.");
      setTimeout(() => {
        this.presentAlert(BorrowedAppConstants.DEVICE_OFFLINE_MESSAGE);
      }, 3000);
    });
    this.connectSubscription$ = this._network.onConnect().subscribe(() => {
      console.log("Internet connection is active now.");
      this.dissmissAlert();
    });
  }

  ngOnDestroy() {
    if (this.disconnectSubscription$) {
      this.disconnectSubscription$.unsubscribe();
    }
    if (this.connectSubscription$) {
      this.connectSubscription$.unsubscribe();
    }
  }
}
