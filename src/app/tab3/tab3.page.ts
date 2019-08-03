import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BorrowedAppConstants } from '../constants';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  cameraOptions: CameraOptions;
  gallaryOptions: CameraOptions;

  storedUserProfile: Observable<any>;

  constructor(
    private _anugularFirestore: AngularFirestore,
    private _angualrFireAuth: AngularFireAuth,
    private _socialShare: SocialSharing,
    private _camera: Camera,
    private _alertController: AlertController
  ) {

    this.storedUserProfile = this._anugularFirestore.collection(BorrowedAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .valueChanges();

    this.cameraOptions = {
      quality: 50,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE,
      targetHeight: 200,
      targetWidth: 200,
      correctOrientation: false,
      cameraDirection: this._camera.Direction.FRONT,
      sourceType: this._camera.PictureSourceType.CAMERA
    }

    this.gallaryOptions = {
      quality: 50,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE,
      targetHeight: 200,
      targetWidth: 200,
      correctOrientation: false,
      sourceType: this._camera.PictureSourceType.SAVEDPHOTOALBUM
    }
  }

  ngOnInit() {

  }

  async selectImageSource() {
    const alert = await this._alertController.create({
      header: "Select Source",
      message: "Pick a source for your Profile picture",
      buttons: [
        {
          text: "Camera",
          handler: () => {
            this.getProfileImage(this.cameraOptions);
          }
        },
        {
          text: "Gallery",
          handler: () => {
            this.getProfileImage(this.gallaryOptions);
          }
        }
      ]
    });
    await alert.present();
  }

  getProfileImage(cameraOption: CameraOptions) {
    this._camera.getPicture(cameraOption)
      .then((imageData) => {
        //store profile image to firestore
        const image = BorrowedAppConstants.BASE64_IMAGE_PREFIX_DATA + imageData;
        this._anugularFirestore.collection(BorrowedAppConstants.USER_COLLECTION)
          .doc(this._angualrFireAuth.auth.currentUser.uid)
          .set({
            profile_image: image
          })

      });
  }

  shareToSocialNetworks() {
    this._socialShare.share(
      "I found this on Borrowed.",
      "",
      "",
      "https://github.com/omkarnagare"
    );
  }

}
