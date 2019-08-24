import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BorrowedAppConstants, ImageType } from '../constants';
import { Observable } from 'rxjs';
import { CloudFilesStorageService } from './cloud-files-storage.service';
import { UserInfo } from '../types';


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
        profile_image: image
      });
    // this._cloudService.uploadImage(ImageType.USER_PROFILE, imageData, {});
  }

  setUserInfo(userInfo: UserInfo) {
    return this._anugularFirestore.collection(BorrowedAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .update({
        name: userInfo.name,
        email: userInfo.email,
        profile_image: "/assets/person.svg"
      });
  }
}
