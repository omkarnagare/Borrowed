import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageType, BorrowedAppConstants } from '../constants';
import { UploadMetadata } from '@angular/fire/storage/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CloudFilesStorageService {

  constructor(
    private _authenticationService: AuthenticationService,
    private _angularFireStorage: AngularFireStorage
  ) { }

  uploadImage(imageType: ImageType, file, metadata: UploadMetadata) {
    let folderName: string;
    switch (imageType) {
      case ImageType.ITEM:
        folderName = BorrowedAppConstants.ITEMS_COLLECTION;
        break;
      case ImageType.USER_PROFILE:
      default:
        folderName = BorrowedAppConstants.PROFILE_IMAGES_COLLECTION;
        break;
    }
    const cloudRef = this._angularFireStorage
      .ref(folderName + "/" + this._authenticationService.getCurrentUserId());
    const task = cloudRef.put(
      file,
      metadata
    );
  }

  uploadTextFile() {
    const newName = `${new Date().getTime()}.txt`;
    const cloudRef = this._angularFireStorage
      .ref(BorrowedAppConstants.ITEMS_COLLECTION + "/" + this._authenticationService.getCurrentUserId() + "/" + newName);
    const task = cloudRef.putString("This is a sample text");
  }

  showImage() {

  }

  updateImage() {

  }

  deleteImage() {

  }
}
