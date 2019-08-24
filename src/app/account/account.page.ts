import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UsersService } from '../services/users.service';
import { GetImageService } from '../services/get-image.service';
import { ImageSourceType, BorrowedAppConstants } from '../constants';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss']
})
export class AccountPage implements OnInit, OnDestroy {
  storedUserProfile: Observable<any>;
  lentItems: Observable<Item[]>;
  urgentMissingItems: Observable<Item[]>;

  lentItems$: Subscription;
  urgentMissingItems$: Subscription;
  storedUserProfile$: Subscription;

  constructor(
    private _usersService: UsersService,
    private _getImageService: GetImageService,
    private _itemsService: ItemsService,
    private _actionSheetController: ActionSheetController,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _alertController: AlertController
  ) {
    this.storedUserProfile = _usersService.getUserProfile();
    this.lentItems = this._itemsService.getItems();
    this.urgentMissingItems = this._itemsService.getUrgentItems();

    this.storedUserProfile$ = this.storedUserProfile.subscribe(data => {
      console.log(data);
    });
    this.lentItems$ = this.lentItems.subscribe(data => {
      console.log(data);
    });
    this.urgentMissingItems$ = this.urgentMissingItems.subscribe(data => {
      console.log(data);
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.storedUserProfile$.unsubscribe();
    this.lentItems$.unsubscribe();
    this.urgentMissingItems$.unsubscribe();
    this.storedUserProfile$ = null;
    this.lentItems$ = null;
    this.urgentMissingItems$ = null;
    this.storedUserProfile = null;
    this.lentItems = null;
    this.urgentMissingItems = null;
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

  async confirmLogOut() {
    const alert = await  this._alertController.create({
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.logOut();
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
        this._usersService.setUserProfileImage(imageData).then(data=> {
          this._authenticationService.showToast(BorrowedAppConstants.USER_IMAGE_SUCCESS_MESSAGE);
        }).catch(error => {
          this._authenticationService.showToast(BorrowedAppConstants.ERROR_MESSAGE);
        });
      },
        (error) => {
          console.log("error occurred while getting Profile Image: ", error);
        });
  }

  logOut() {
    this._authenticationService.logOut().then(() => {
      // this._router.navigate(['']);
      console.log("User logged out successfully");
      window.location.reload();
    }).catch((error) => {
      console.log("Log Out Error :", error);
      this._authenticationService.showToast(error);
    });
  }

}
