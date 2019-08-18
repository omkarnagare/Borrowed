import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Item } from '../types';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BorrowedAppConstants } from '../constants';
import { AuthenticationService } from './authentication.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  collectionRef: AngularFirestoreCollection;

  constructor(
    private _angularFirestore: AngularFirestore,
    private _authenticationService: AuthenticationService,
    private _toastController: ToastController
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
        this.showToast("Couldn't connect to database. Please try again with healthy internet connection.");
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
      lendeeEmail: itemDetails.lendeeEmail
    });
  }

  getItem(itemId: string): Observable<any> {
    return this.collectionRef
    .doc(itemId).valueChanges();
  }

  getItems(): Observable<any> {
    return this.collectionRef
    .snapshotChanges()
    .pipe(
      map(actions => {
        return actions.map(action => ({ itemId: action.payload.doc.id, ...action.payload.doc.data() }));
      })
    );
  }

  updateItem(itemId: string, itemDetails: Item) {
    return this.collectionRef
    .doc(itemId).set(itemDetails);
  }

  deleteItem(itemId: string) {
    return this.collectionRef
    .doc(itemId).delete();
  }

  getUrgentItems(): Observable<any> {
    return this.getItems().pipe(
      map ((data) => {
        return data.filter( item => item.isUrgent );
      })
    );
  }

  showToast(message: any) {
    const toast = this._toastController.create({
      message: message,
      duration: 4000,
      position: "bottom",
      showCloseButton: true,
      closeButtonText: "dismiss",
      color: "primary",
      translucent: true
    });
    toast.then((toastMessage) => {
      toastMessage.present();
    });
  }

}
