import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SocialNetworksService } from '../services/social-networks.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { AppInfoService } from '../services/app-info.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  contactUsFormGroup: FormGroup;
  validationMessages: any;

  loader: any = null;

  constructor(
    private _alertController: AlertController,
    private _loadingController: LoadingController,
    private _socialSharing: SocialNetworksService,
    private _appInfoService: AppInfoService,
    formBuilder: FormBuilder
  ) {
    this.contactUsFormGroup = formBuilder.group({
      // from: ["", [Validators.required, Validators.email]],
      subject: ["", [Validators.required]],
      body: ["", [Validators.required]]
    });

    this.validationMessages = {
      // 'from': [
      //   { type: 'required', message: 'User email cannot be left blank.' },
      //   { type: 'email', message: 'Not a valid Email address.' }],
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

  async showAlertForSendingEmail() {
    const alert = await  this._alertController.create({
      message: 'This will send a email to Team Borrowed. Would you like to continue?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.presentLoader().then(() => {
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
    const alert = await  this._alertController.create({
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

  async presentLoader() {
    if (!this.loader) {
      this.loader = await this._loadingController.create({
        message: 'Sending mail ...'
      });
      await this.loader.present();
    }
  }

  async stopLoader() {
    if (this.loader) {
      await this.loader.dismiss();
      this.loader = null;
    }
  }

  sendEmail() {
    const formValue = this.contactUsFormGroup.value;
    this._socialSharing.sendEmail({
      message: formValue.body,
      subject: formValue.subject + "::" + this._appInfoService.getAppDetails(),
      to: ["omtechnologies.apps@gmail.com"]
    }).then(response => {
      this.stopLoader().then(() => {
        this.showAlertForSentEmail();
      });
    }).catch(error=> {
      console.error(error);
      this.stopLoader();
    })
  }

}
