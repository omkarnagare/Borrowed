import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Item } from '../types';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BorrowedAppConstants } from '../constants';
import { AuthenticationService } from './authentication.service';
import { ToastController } from '@ionic/angular';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  collectionRef: AngularFirestoreCollection;

  constructor(
    private _angularFirestore: AngularFirestore,
    private _authenticationService: AuthenticationService,
    private _toastController: ToastController,
    private _networkService: NetworkService
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
      dateBorrowed: itemDetails.dateBorrowed,
      isUrgent: itemDetails.isUrgent,
      itemImage: itemDetails.itemImage
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

  showToast(errorMessage: any) {
    const toast = this._toastController.create({
      message: errorMessage,
      duration: 4000,
      position: "top",
      showCloseButton: true,
      closeButtonText: "dismiss"
    });
    toast.then((toastMessage) => {
      toastMessage.present();
    });
  }

}
