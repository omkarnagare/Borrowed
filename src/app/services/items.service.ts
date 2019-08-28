import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Item } from '../types';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BorrowedAppConstants } from '../constants';
import { AuthenticationService } from './authentication.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ItemsService implements OnDestroy {
  loader: any = null;
  collectionRef: AngularFirestoreCollection;

  canViewTransactionCompleteItems: boolean = false;

  constructor(
    private _angularFirestore: AngularFirestore,
    private _authenticationService: AuthenticationService,
    private _toastController: ToastController,
    private _loadingController: LoadingController,
    private _alertController: AlertController,
    private _storage: Storage
  ) {

    this._storage.get(BorrowedAppConstants.VIEW_TRANSACTION_COMPLETE_ITEMS).then(canViewTransactionCompleteItems => {
      if (canViewTransactionCompleteItems !== null || canViewTransactionCompleteItems !== undefined) {
        this.canViewTransactionCompleteItems = canViewTransactionCompleteItems;
      }
      console.log("canViewTransactionCompleteItems", this.canViewTransactionCompleteItems)
    }).catch(error => {
      console.log("canViewTransactionCompleteItems", error);
    });

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
      this.showToast("Couldn't connect to database. Please try again with healthy internet connection.");
    }
  }

  setCanViewTransactionCompleteItems(canViewTransactionCompleteItems: boolean) {
    this.canViewTransactionCompleteItems = canViewTransactionCompleteItems;
  }

  async presentLoader() {
    if (!this.loader) {
      this.loader = await this._loadingController.create({
        message: 'Processing your request ...'
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

  getItems(): Observable<any> {
    const allItems = this.collectionRef
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => ({ itemId: action.payload.doc.id, ...action.payload.doc.data() }));
        })
      ).pipe(
        map((data) => {
          return data.filter(item => this.canViewTransactionCompleteItems ? true : item["isActive"] === true);
        }));
    return allItems;
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
    return this.getItems().pipe(
      map((data) => {
        return data.filter(item => item.isUrgent);
      })
    );
  }

  showToast(message: any, duration = 2000) {
    const toast = this._toastController.create({
      message: message,
      duration: duration,
      position: "bottom",
      showCloseButton: true,
      closeButtonText: "Dismiss",
      color: "primary",
    });
    toast.then((toastMessage) => {
      toastMessage.present();
    });
  }

  ngOnDestroy() {
    this.collectionRef = null;
  }

  async showAlertForDelete(item: Item) {
    const alert = await this._alertController.create({
      header: "Attention, Permanent Deletion !!!",
      message: 'This will delete the item permanently. This action cannot be undone. Do you want to Continue?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.presentLoader().then(() => {
              this.deleteItemPermanently(item.itemId).then(() => {
              }).catch(error => {
                this.showToast(error);
              }).finally(() => {
                this.stopLoader();
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
      message: this.canViewTransactionCompleteItems ? " To hide transaction-complete Item, Un-check \"SHOW TRANSACTION COMPLETE ITEMS\" in settings." : " To view transaction-complete Items, Check \"SHOW TRANSACTION COMPLETE ITEMS\" in settings.",
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            this.presentLoader().then(() => {
              this.markItemAsTransactionComplete(item.itemId).then(() => {
              }).catch(error => {
                this.showToast(error);
              }).finally(() => {
                this.stopLoader();
              });
            });
          }
        }
      ]
    });
    await alert.present();
  }

}
