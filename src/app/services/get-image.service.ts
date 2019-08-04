import { Injectable } from '@angular/core';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { ImageSourceType, BorrowedAppConstants } from '../constants';

import { File, FileEntry } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Platform } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Injectable({
  providedIn: 'root'
})
export class GetImageService {
  currentImage: any;
  imageBlob: any;

  cameraOptions: CameraOptions;
  gallaryOptions: CameraOptions;

  constructor(
    private _camera: Camera,
    private _file: File,
    private _filePath: FilePath,
    private _platform: Platform,
    private _webview: WebView,
  ) {

    this.cameraOptions = {
      quality: 50,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE,
      targetHeight: 200,
      targetWidth: 200,
      correctOrientation: false,
      saveToPhotoAlbum: false,
      cameraDirection: this._camera.Direction.FRONT,
      sourceType: this._camera.PictureSourceType.CAMERA
    }

    this.gallaryOptions = {
      quality: 50,
      destinationType: this._camera.DestinationType.DATA_URL,
      // destinationType: this._camera.DestinationType.FILE_URI,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE,
      targetHeight: 200,
      targetWidth: 200,
      correctOrientation: false,
      saveToPhotoAlbum: false,
      sourceType: this._camera.PictureSourceType.PHOTOLIBRARY
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
    // .then(imagePath => {
    //   if (
    //     this._platform.is('android')
    //     && sourceType === this._camera.PictureSourceType.PHOTOLIBRARY
    //   ) {
    //     this._filePath
    //       .resolveNativePath(imagePath)
    //       .then(filePath => {
    //         let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
    //         let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1,
    //           imagePath.lastIndexOf('?'));
    //         this.copyFileToLocalDir(correctPath, currentName, new Date().getTime() + ".jpg");
    //       });
    //   } else {
    //     var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
    //     var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
    //     this.copyFileToLocalDir(correctPath, currentName, new Date().getTime() + ".jpg");
    //   }
    // })
    // .then((result) => {
    //   this._file.resolveLocalFilesystemUrl(this.currentImage.filePath)
    //     .then((entry) => {
    //       const fileEntry = entry as FileEntry;
    //       fileEntry.file(file => {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //           // const formData = new FormData();
    //           this.imageBlob = new Blob([reader.result], {
    //             type: file.type
    //           });
    //           // formData.append('file', imgBlob, file.name);
    //           // upload here in the example

    //         };
    //         reader.readAsArrayBuffer(file);
    //       });
    //     }).catch((error) => {
    //       console.log("Error while reading file.");
    //     });
    // });
  }

  // copyFileToLocalDir(namePath, currentName, newFileName) {
  //   this._file.copyFile(namePath, currentName, this._file.dataDirectory, newFileName).
  //     then(success => {

  //       let filePath = this._file.dataDirectory + newFileName;
  //       let resPath = filePath === null ? '' : this._webview.convertFileSrc(filePath);

  //       this.currentImage = {
  //         name: newFileName,
  //         path: resPath,
  //         filePath: filePath
  //       };

  //     }, error => {
  //       console.log("Error while storing file.");
  //     });
  // }

  // deleteImage() {
  //   const correctPath = this.currentImage.filePath.substr(0, this.currentImage.filePath.lastIndexOf('/') + 1);
  //   this._file.removeFile(correctPath, this.currentImage.name).then(res => {
  //     console.log("File removed.");
  //   });
  // }
}
