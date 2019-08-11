import { Injectable } from '@angular/core';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { ImageSourceType, BorrowedAppConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class GetImageService {
  currentImage: any;

  cameraOptions: CameraOptions;
  gallaryOptions: CameraOptions;

  constructor(
    private _camera: Camera
  ) {

    this.cameraOptions = {
      quality: 50,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE,
      targetHeight: 200,
      targetWidth: 200,
      correctOrientation: true,
      saveToPhotoAlbum: false,
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
      correctOrientation: true,
      saveToPhotoAlbum: false,
      sourceType: this._camera.PictureSourceType.PHOTOLIBRARY
    }

  }

  getImage(sourceType: ImageSourceType): Promise<any> {
    let imageOptions: CameraOptions;
    switch (sourceType) {
      case ImageSourceType.FRONT_CAMERA:
          imageOptions = this.cameraOptions;
          imageOptions.cameraDirection = this._camera.Direction.FRONT;
          break;
      case ImageSourceType.BACK_CAMERA:
        imageOptions = this.cameraOptions;
        imageOptions.cameraDirection = this._camera.Direction.BACK;
        break;
      case ImageSourceType.GALLERY:
      default:
        imageOptions = this.gallaryOptions;
        break;
    }
    return this._camera.getPicture(imageOptions);
  }
}
