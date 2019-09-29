import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SocialNetworksService } from '../services/social-networks.service';
import { AlertController } from '@ionic/angular';
import { AppInfoService } from '../services/app-info.service';
import { AdmobAdsService } from '../services/admob-ads.service';
import { PlatformInfoService } from '../services/platform-info.service';
import { BorrowedAppConstants } from '../constants';
import { LoaderManagerService } from '../services/loader-manager.service';

import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
  animations: [
    trigger('fadein', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slidelefttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }, ))
      ])
    ]),
    trigger('sliderighttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }, ))
      ])
    ]),
    trigger('slidetoptitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }, ))
      ])
    ]),
    trigger('slidebottomtitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }, ))
      ])
    ])
  ]
})
export class ContactUsPage implements OnInit {

  isMobilePlatform = null;

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
    this.isMobilePlatform = this._platformInfoService.isMobilePlatform();
    this._admobService.showInterStitialAd();
  }

  async showAlertForSendingEmail() {
    const alert = await this._alertController.create({
      header: 'Confirm Action',
      message: 'This will send a email to Team Borrowing. Would you like to continue?',
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
      header: 'Success',
      message: 'The mail has been sent to Team Borrowing successfully. \
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
