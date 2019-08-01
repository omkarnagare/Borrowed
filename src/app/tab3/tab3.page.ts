import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  cameraOptions: CameraOptions;
  gallaryOptions: CameraOptions;

  profileImage: any;

  constructor(
    private _socialShare: SocialSharing,
    private _camera: Camera,
    private _alertController: AlertController
  ) {

    this.profileImage = "/assets/shapes.svg";

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

  getProfileImage(cameraOption: CameraOptions){
    this._camera.getPicture(cameraOption)
    .then ((imageData) => {
      this.profileImage = "data:image/jpeg;base64,"+ imageData;
    });
  }

  shareToSocialNetworks(){
    this._socialShare.share(
      "I found this on Borrowed.",
      "",
      "",
      "https://github.com/omkarnagare"
    );
  }

}
