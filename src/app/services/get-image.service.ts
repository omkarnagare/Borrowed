import { Injectable } from '@angular/core';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { ImageSourceType } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class GetImageService {

  cameraOptions: CameraOptions;
  gallaryOptions: CameraOptions;

  constructor(
    private _camera: Camera
  ) {

    this.cameraOptions = {
      quality: 10,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE,
      targetHeight: 100,
      targetWidth: 100,
      correctOrientation: false,
      cameraDirection: this._camera.Direction.FRONT,
      sourceType: this._camera.PictureSourceType.CAMERA
    }

    this.gallaryOptions = {
      quality: 10,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE,
      targetHeight: 100,
      targetWidth: 100,
      correctOrientation: false,
      sourceType: this._camera.PictureSourceType.SAVEDPHOTOALBUM
    }

  }

  getImage(sourceType: ImageSourceType): Promise<any> {
    let imageOptions: CameraOptions;
    switch (sourceType) {
      case ImageSourceType.CAMERA:
        imageOptions = this.cameraOptions;
        break;
      case ImageSourceType.GALLERY:
      default:
        imageOptions = this.gallaryOptions;
        break;
    }
    return this._camera.getPicture(imageOptions);
  }
}
