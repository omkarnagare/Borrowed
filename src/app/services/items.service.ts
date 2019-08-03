import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { Item } from '../types';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BorrowedAppConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(
    private _angularFirestore: AngularFirestore,
    private _angularFireAuth: AngularFireAuth,
    private _httpClient: HttpClient
    ) { }

  getItem(itemId: string): Observable<Item> {
    // return this._httpClient.get<Item>("");
    return of(
      {
        "itemId": "1",
        "itemName": "Borrowed.",
        "itemDescription": "App which makes you un-forget",
        "dateBorrowed": "today",
        "itemImage": "/assets/shapes.svg",
        "itemCategory": "Category"
      });
  }

  getItems(): Observable<Item[]> {
    // return this._httpClient.get<Item[]>("");
    return of([
      {
        "itemId": "1",
        "itemName": "Borrowed.",
        "itemDescription": "App which makes you un-forget",
        "dateBorrowed": "today",
        "itemImage": "/assets/shapes.svg",
      },
      {
        "itemId": "2",
        "itemName": "Item-1",
        "itemDescription": "Item-Description",
        "dateBorrowed": "today",
        "itemImage": "/assets/shapes.svg",
      }
    ]);
  }

  getUrgentItems(): Observable<any> {
    
    // return this._angularFirestore.collection(BorrowedAppConstants.ITEMS_COLLECTION)
    // .doc(this._angularFireAuth.auth.currentUser.uid)
    // .collection(BorrowedAppConstants.ITEMS_COLLECTION)
    // .valueChanges();
    

    return of([
      {
        "itemId": "1",
        "itemName": "Borrowed.",
        "itemDescription": "App which makes you un-forget",
        "dateBorrowed": "today",
        "itemImage": "/assets/shapes.svg",
      },
      {
        "itemId": "2",
        "itemName": "Item-1",
        "itemDescription": "Item-Description",
        "dateBorrowed": "today",
        "itemImage": "/assets/shapes.svg",
      }
    ]);
  }
}
