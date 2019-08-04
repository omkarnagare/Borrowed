import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Item } from '../types';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BorrowedAppConstants } from '../constants';
import { AuthenticationService } from './authentication.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(
    private _angularFirestore: AngularFirestore,
    private _authenticationService: AuthenticationService,
    private _toastController: ToastController
    ) { }

  addItem(itemDetails: Item): Promise<any> {
    return this._angularFirestore.collection(BorrowedAppConstants.ITEMS_COLLECTION)
    .doc(this._authenticationService.getCurrentUserId())
    .collection(BorrowedAppConstants.ITEMS_COLLECTION)
    .add({
      itemName: itemDetails.itemName,
      itemDescription: itemDetails.itemDescription,
      dateBorrowed: itemDetails.dateBorrowed,
      isUrgent: itemDetails.isUrgent
    });
  }

  getItem(itemId: string): Observable<any> {
    return this._angularFirestore.collection(BorrowedAppConstants.ITEMS_COLLECTION)
    .doc(this._authenticationService.getCurrentUserId())
    .collection(BorrowedAppConstants.ITEMS_COLLECTION)
    .doc(itemId).valueChanges();
  }

  getItems(): Observable<any> {
    return this._angularFirestore.collection(BorrowedAppConstants.ITEMS_COLLECTION)
    .doc(this._authenticationService.getCurrentUserId())
    .collection(BorrowedAppConstants.ITEMS_COLLECTION)
    .snapshotChanges()
    .pipe(
      map(actions => {
        return actions.map(action => ({ itemId: action.payload.doc.id, ...action.payload.doc.data() }));
      })
    );
  }

  updateItem(itemId: string, itemDetails: Item) {
    return this._angularFirestore.collection(BorrowedAppConstants.ITEMS_COLLECTION)
    .doc(this._authenticationService.getCurrentUserId())
    .collection(BorrowedAppConstants.ITEMS_COLLECTION)
    .doc(itemId).set(itemDetails);
  }

  deleteItem(itemId: string) {
    return this._angularFirestore.collection(BorrowedAppConstants.ITEMS_COLLECTION)
    .doc(this._authenticationService.getCurrentUserId())
    .collection(BorrowedAppConstants.ITEMS_COLLECTION)
    .doc(itemId).delete();
  }

  getUrgentItems(): Observable<any> {
    return this.getItems().pipe(
      map ((data) => {
        return data.filter( item => item.isUrgent );
      })
    );
  }

  showToast(errorMessage: any) {
    const toast = this._toastController.create({
      message: errorMessage,
      duration: 4000,
      position: "top"
    });
    toast.then((toastMessage) => {
      toastMessage.present();
    });
  }

}
