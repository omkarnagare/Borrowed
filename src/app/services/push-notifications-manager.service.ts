import { Injectable, OnDestroy } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { BorrowedAppConstants } from '../constants';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsManagerService implements OnDestroy {

  constructor(
    private fcm: FCM,
    private _alertController: AlertController) { }

  setUpFCM() {

    this.fcm.getToken().then(token => {
      console.log(token);
      // this.fcm.subscribeToTopic(BorrowedAppConstants.PUSH_NOTIFICATION_TOPIC);
    }).catch(error => {
      console.error(error);
    });
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log(token);
    });

    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        console.log("Received in background");
      } else {
        console.log("Received in foreground");
        this.showAlertFromPushNotification(data);
      };
    });

  }

  async showAlertFromPushNotification(data) {
    const alert = await this._alertController.create({
      header: "Notification from Team Borrowing",
      message: data.title + " : " + data.body,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  ngOnDestroy() {
    // this.fcm.unsubscribeFromTopic(BorrowedAppConstants.PUSH_NOTIFICATION_TOPIC);
  }
}
