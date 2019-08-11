import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';
import { SocialNetworksService } from '../services/social-networks.service';
import { GetImageService } from '../services/get-image.service';
import { ImageSourceType } from '../constants';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
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
  missingItems: Observable<Item[]>;
  urgentMissingItems: Observable<Item[]>;

  constructor(
    private _router: Router,
    private _usersService: UsersService,
    private _socialNetworkService: SocialNetworksService,
    private _authenticationService: AuthenticationService,
    private _getImageService: GetImageService,
    private _itemsService: ItemsService,
    private _actionSheetController: ActionSheetController
  ) {
    this.storedUserProfile = _usersService.getUserProfile();
    this.missingItems = this._itemsService.getItems();
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
            this.getProfileImage(ImageSourceType.BACK_CAMERA);
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

  shareToSocialNetworks() {
    this._socialNetworkService.shareToSocialNetworks({});
  }

  logOut() {
    this._authenticationService.logOut().then(() => {
      this._router.navigate(['']);
      console.log("User logged out successfully");
    }).catch((error) => {
      console.log("Log Out Error :", error);
      this._authenticationService.showToast(error);
    });
  }

}
