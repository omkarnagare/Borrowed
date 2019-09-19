import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BorrowedAppConstants, ImageType } from '../constants';
import { Observable } from 'rxjs';
import { CloudFilesStorageService } from './cloud-files-storage.service';
import { UserInfo, SocialUserInfo } from '../types';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private _anugularFirestore: AngularFirestore,
    private _angualrFireAuth: AngularFireAuth,
    private _cloudService: CloudFilesStorageService
  ) { }

  getUserProfile(): Observable<any> {
    return this._anugularFirestore.collection(BorrowedAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .valueChanges();
  }

  setUserProfileImage(imageData: any) {
    const image = BorrowedAppConstants.BASE64_IMAGE_PREFIX_DATA + imageData;
    return this._anugularFirestore.collection(BorrowedAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .update({
        profileImage: image
      });
    // this._cloudService.uploadImage(ImageType.USER_PROFILE, imageData, {});
  }

  setPIN(pin: string) {
    return this._anugularFirestore.collection(BorrowedAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .update({
        pin: pin
      });
  }

  removePIN() {
    return this.setPIN("");
  }

  setUserInfo(userInfo: UserInfo) {
    return this._anugularFirestore.collection(BorrowedAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .set({
        name: userInfo.name,
        email: userInfo.email,
        profileImage: "/assets/person.svg"
      });
  }

  setUserInfoFromGooglePlus(userInfo: SocialUserInfo) {
    return this._anugularFirestore.collection(BorrowedAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .set({
        name: userInfo.displayName,
        email: userInfo.email,
        profileImage: userInfo.photoURL
      });
  }
}
