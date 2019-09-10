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
        isActive: true
      });
  }

  getItem(itemId: string): Observable<any> {
    return this.collectionRef
      .doc(itemId).valueChanges();
  }

  getActiveItems(): Observable<any> {
    return this.getAllItems().pipe(
      map((data) => {
        return data.filter(item => item["isActive"] === true);
      }));
  }

  getTransactionCompleteItems(): Observable<any> {
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
          return actions.map(action => ({ itemId: action.payload.doc.id, ...action.payload.doc.data() }));
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
      message: "To view transaction-complete Items, go to Account details.",
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
