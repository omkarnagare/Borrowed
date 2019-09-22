import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../types';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BorrowedAppConstants } from '../constants';
import { AuthenticationService } from './authentication.service';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { LoaderManagerService } from './loader-manager.service';
import { ToastManagerService } from './toast-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService implements OnDestroy {
  collectionRef: AngularFirestoreCollection;

  constructor(
    private _angularFirestore: AngularFirestore,
    private _authenticationService: AuthenticationService,
    private _toastManager: ToastManagerService,
    private _loader: LoaderManagerService,
    private _alertController: AlertController,
    private _storage: Storage
  ) {
    this.collectionRef = this._angularFirestore
      .collection(BorrowedAppConstants.ITEMS_COLLECTION)
      .doc(this._authenticationService.getCurrentUserId())
      .collection(BorrowedAppConstants.ITEMS_COLLECTION);
    if (this.collectionRef) {
      this.collectionRef.ref.get().then().catch(error => {
        // no need to check - as data persistence is enabled
        // this._networkService.presentAlert('Error occurred while connecting to database');
      });
    } else {
      this._toastManager.showToast("Couldn't connect to database. Please try again with healthy internet connection.");
    }
  }

  addItem(itemDetails: Item): Promise<any> {
    return this.collectionRef
      .add({
        itemName: itemDetails.itemName,
        itemDescription: itemDetails.itemDescription,
        borrowingDate: itemDetails.borrowingDate,
        isUrgent: itemDetails.isUrgent,
        itemImage: itemDetails.itemImage,
        lendeeName: itemDetails.lendeeName,
        lendeeContact: itemDetails.lendeeContact,
        lendeeEmail: itemDetails.lendeeEmail,

        transactionType: itemDetails.transactionType,
        importance: itemDetails.importance,
        eventDate: itemDetails.eventDate,
        expectedReturnDate: itemDetails.expectedReturnDate,
        personName: itemDetails.personName,
        personContactNumber: itemDetails.personContactNumber,
        personEmail: itemDetails.personEmail,

        isActive: true
      });
  }

  getItem(itemId: string): Observable<any> {
    return this.collectionRef
      .doc(itemId).valueChanges().pipe(
        map(item => {
          // TODO: remove when app version for all user is greater than 1.1
          return this.handleOldItem(item);
        })
      );
  }

  // TODO: remove when app version for all user is greater than 1.1
  handleOldItem(data: Item): Item {
    if (data.transactionType) {
      // new data - no need to process
      return data;
    } else {
      data.transactionType = "borrowed";
      data.importance = "low";
      data.eventDate = data.borrowingDate;
      data.expectedReturnDate = this.getDateOfOneMonthLater(data.borrowingDate);
      data.personName = data.lendeeName;
      data.personContactNumber = data.lendeeContact;
      data.personEmail = data.lendeeEmail;
      return data;
    }
  }

  getDateOfOneMonthLater(dateStr: string): string {
    const date = new Date(dateStr);
    const laterDate = new Date(dateStr);
    laterDate.setMonth(date.getMonth() + 1);
    return this.dateToLocalISO(laterDate);
  }

  dateToLocalISO(date: Date): string {
    var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function (num) {
        var norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
      };
    return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      '.' + pad(date.getMilliseconds()) +
      dif + pad(tzo / 60) +
      ':' + pad(tzo % 60);
  }

  getActiveItems(): Observable<any> {
    return this.getAllItems().pipe(
      map((data) => {
        return data.filter(item => item["isActive"] === true);
      }));
  }

  getDoneItems(): Observable<any> {
    return this.getAllItems().pipe(
      map((data) => {
        return data.filter(item => item["isActive"] === false);
      }));
  }

  getAllItems(): Observable<any> {
    return this.collectionRef
      .snapshotChanges()
      .pipe(
        map(actions => {
          const data = actions.map(action => ({ itemId: action.payload.doc.id, ...action.payload.doc.data() }));
          
          // handling old-item data
          // TODO: remove when app version for all user is greater than 1.1
          const items = [];
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            items.push(this.handleOldItem(element));
          }

          return items;
        })
      );
  }

  updateItem(itemId: string, itemDetails: any) {
    return this.collectionRef
      .doc(itemId).update(itemDetails);
  }

  markItemAsTransactionComplete(itemId: string) {
    return this.collectionRef
      .doc(itemId).update({ isActive: false });
  }

  deleteItemPermanently(itemId: string) {
    return this.collectionRef
      .doc(itemId).delete();
  }

  remove(item: Item) {
    if (item.isActive) {
      this.showAlertForTransactionComplete(item);
    } else {
      // transaction complete items
      this.showAlertForDelete(item);
    }
  }

  getUrgentItems(): Observable<any> {
    return this.getActiveItems().pipe(
      map((data) => {
        return data.filter(item => item.isUrgent);
      })
    );
  }

  ngOnDestroy() {
    this.collectionRef = null;
  }

  async showAlertForDelete(item: Item) {
    const alert = await this._alertController.create({
      header: "Attention, Permanent Deletion !!!",
      message: 'This action cannot be undone. Do you want to Continue?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this._loader.presentLoader().then(() => {
              this.deleteItemPermanently(item.itemId).then(() => {
              }).catch(error => {
                this._toastManager.showErrorToast(error);
              }).finally(() => {
                this._loader.stopLoader();
              });
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async showAlertForTransactionComplete(item: Item) {
    const alert = await this._alertController.create({
      header: "Hurray!! Borrowing Transaction completed.",
      message: "To view transaction-complete Items in Items history, go to Account details.",
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            this._loader.presentLoader().then(() => {
              this.markItemAsTransactionComplete(item.itemId).then(() => {
              }).catch(error => {
                this._toastManager.showErrorToast(error);
              }).finally(() => {
                this._loader.stopLoader();
              });
            });
          }
        }
      ]
    });
    await alert.present();
  }

}
