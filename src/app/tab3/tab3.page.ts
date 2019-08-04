import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';
import { SocialNetworksService } from '../services/social-networks.service';
import { GetImageService } from '../services/get-image.service';
import { ImageSourceType } from '../constants';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  storedUserProfile: Observable<any>;

  constructor(
    private _router: Router,
    private _usersService: UsersService,
    private _socialNetworkService: SocialNetworksService,
    private _authenticationService: AuthenticationService,
    private _getImageService: GetImageService,
    private _alertController: AlertController
  ) {
    this.storedUserProfile = _usersService.getUserProfile();
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
            this.getProfileImage(ImageSourceType.CAMERA);
          }
        },
        {
          text: "Gallery",
          handler: () => {
            this.getProfileImage(ImageSourceType.GALLERY);
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
