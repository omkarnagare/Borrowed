import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BorrowedAppConstants } from '../constants';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private _anugularFirestore: AngularFirestore,
    private _angualrFireAuth: AngularFireAuth
  ) { }

  getUserProfile(): Observable<any> {
    return this._anugularFirestore.collection(BorrowedAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .valueChanges();
  }

  setUserProfileImage(imageData: any) {
    const image = BorrowedAppConstants.BASE64_IMAGE_PREFIX_DATA + imageData;
    console.log(image);
    // this._anugularFirestore.collection(BorrowedAppConstants.USER_COLLECTION)
    //   .doc(this._angualrFireAuth.auth.currentUser.uid)
    //   .set({
    //     profile_image: image
    //   });
  }
}
