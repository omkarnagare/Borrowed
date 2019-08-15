import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';
import { GetImageService } from '../services/get-image.service';
import { ImageSourceType } from '../constants';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  storedUserProfile: Observable<any>;
  lentItems: Observable<Item[]>;
  urgentMissingItems: Observable<Item[]>;

  constructor(
    private _usersService: UsersService,
    private _getImageService: GetImageService,
    private _itemsService: ItemsService,
    private _actionSheetController: ActionSheetController
  ) {
    this.storedUserProfile = _usersService.getUserProfile();
    this.lentItems = this._itemsService.getItems();
    this.urgentMissingItems = this._itemsService.getUrgentItems();
  }

  ngOnInit() {

  }

  async selectImageSource() {
    const alert = await this._actionSheetController.create({
      buttons: [
        {
          text: "Camera",
          icon: 'camera',
          handler: () => {
            this.getProfileImage(ImageSourceType.FRONT_CAMERA);
          }
        },
        {
          text: "Gallery",
          icon: 'images',
          handler: () => {
            this.getProfileImage(ImageSourceType.GALLERY);
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await alert.present();
  }

  getProfileImage(sourceType: ImageSourceType) {
    this._getImageService.getImage(sourceType)
      .then((imageData) => {
        // console.log(imageData);
        this._usersService.setUserProfileImage(imageData);
      },
        (error) => {
          console.log("error occurred while getting Profile Image: ", error);
        });
  }

}
