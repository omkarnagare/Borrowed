import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BorrowedAppConstants, ImageType } from '../constants';
import { Observable } from 'rxjs';
import { CloudFilesStorageService } from './cloud-files-storage.service';


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
    this._anugularFirestore.collection(BorrowedAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .set({
        profile_image: image
      });
    // this._cloudService.uploadImage(ImageType.USER_PROFILE, imageData, {});
  }
}
