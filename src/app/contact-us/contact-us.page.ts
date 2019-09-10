import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SocialNetworksService } from '../services/social-networks.service';
import { AlertController } from '@ionic/angular';
import { AppInfoService } from '../services/app-info.service';
import { AdmobAdsService } from '../services/admob-ads.service';
import { PlatformInfoService } from '../services/platform-info.service';
import { BorrowedAppConstants } from '../constants';
import { LoaderManagerService } from '../services/loader-manager.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  isMobilePlatform: boolean = false;

  supportEmail: string;

  contactUsFormGroup: FormGroup;
  validationMessages: any;

  constructor(
    private _alertController: AlertController,
    private _loader: LoaderManagerService,
    private _socialSharing: SocialNetworksService,
    private _appInfoService: AppInfoService,
    private _admobService: AdmobAdsService,
    private _platformInfoService: PlatformInfoService,
    formBuilder: FormBuilder
  ) {
    this.isMobilePlatform = this._platformInfoService.isMobilePlatform();
    this.supportEmail = BorrowedAppConstants.SUPPORT_EMAIL;
    this.contactUsFormGroup = formBuilder.group({
      // from: ["", [Validators.required, Validators.email]],
      subject: ["", [Validators.required]],
      body: ["", [Validators.required]]
    });

    this.validationMessages = {
      'subject': [
        { type: 'required', message: 'Subject cannot be left blank.' }],
      'body': [
        { type: 'required', message: 'Body cannot be left blank.' }]
    };

  }

  isError(name: string, validationType: string): boolean {
    return this.contactUsFormGroup.get(name).hasError(validationType) && (this.contactUsFormGroup.get(name).dirty || this.contactUsFormGroup.get(name).touched)
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this._admobService.showInterStitialAd();
  }

  async showAlertForSendingEmail() {
    const alert = await this._alertController.create({
      message: 'This will send a email to Team Borrowed. Would you like to continue?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this._loader.presentLoader().then(() => {
              this.sendEmail();
            });
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async showAlertForSentEmail() {
    const alert = await this._alertController.create({
      message: 'The mail has been sent to Team Borrowed successfully. \
      Team will contact you shortly if required.',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  sendEmail() {
    const formValue = this.contactUsFormGroup.value;
    this._socialSharing.sendEmail({
      message: formValue.body,
      subject: formValue.subject + "::" + this._appInfoService.getAppDetails(),
      to: [this.supportEmail]
    }).then(response => {
      this._loader.stopLoader().then(() => {
        this.showAlertForSentEmail();
      });
    }).catch(error => {
      console.error(error);
      this._loader.stopLoader();
    })
  }

}
