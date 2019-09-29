import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Item, WhatsAppAttributes, EmailAttributes, FacebookAttributes, InstagramAttributes, TwitterAttributes, GenericShare } from '../types';
import { ItemsService } from '../services/items.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialNetworksService } from '../services/social-networks.service';
import { DatePipe } from '@angular/common';
import { PlatformInfoService } from '../services/platform-info.service';
import { LoaderManagerService } from '../services/loader-manager.service';
import { ToastManagerService } from '../services/toast-manager.service';
import { BorrowedAppConstants, ImageSourceType, SOCIAL_SHARE_OPTIONS } from '../constants';
import { GetImageService } from '../services/get-image.service';
import { ActionSheetController, AlertController } from '@ionic/angular';

import { trigger, state, transition, style, animate } from '@angular/animations';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
  animations: [
    trigger('fadein', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate('600ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slidelefttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('sliderighttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('slidetoptitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ]),
    trigger('slidebottomtitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ])
  ]
})
export class ItemDetailsPage implements OnDestroy {

  itemId: string;
  itemObject: Item = null;
  itemDetails$: Subscription;

  isMobilePlatform: boolean = false;

  today: any;
  itemDetailsFormGroup: FormGroup;
  validationMessages: any;
  itemImage: any;
  importance: string;
  editing: boolean = false;

  constructor(
    private _itemService: ItemsService,
    private _loader: LoaderManagerService,
    private _toastManager: ToastManagerService,
    private _socialNetworksService: SocialNetworksService,
    private _platformInfoService: PlatformInfoService,
    private _getImageService: GetImageService,
    private _actionSheetController: ActionSheetController,
    private _alertController: AlertController,
    private _datePipe: DatePipe,
    private _router: Router,
    activatedRoute: ActivatedRoute,
    formBuilder: FormBuilder
  ) {
    this.today = new Date().toISOString();
    this.isMobilePlatform = this._platformInfoService.isMobilePlatform();

    this.itemId = activatedRoute.snapshot.params["itemId"];
    this.itemDetails$ = this._itemService.getItem(this.itemId)
      .subscribe((item) => {
        console.log("item details", item);
        if (item) {
          this.itemObject = item;
          this.prePopulateValues();
        }
      });

    this.itemDetailsFormGroup = formBuilder.group({
      // item related
      itemName: ["", [Validators.required]],
      eventDate: ["", [Validators.required]],
      expectedReturnDate: "",
      itemDescription: "",
      personName: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")]],
      personContactNumber: ["", [Validators.pattern("^([+][0-9]{0,4}\-?)?[0-9]{10}$")]],
      personEmail: ["", [Validators.email]],
    });

    this.validationMessages = {
      'itemName': [{ type: 'required', message: 'Item name cannot be left blank.' }],
      'eventDate': [{ type: 'required', message: 'Date of event cannot be left blank.' }],
      'personName': [
        { type: 'required', message: 'Person name cannot be left blank.' },
        { type: 'pattern', message: 'Not a valid Name.' }],
      'personContactNumber': [
        { type: 'pattern', message: 'Valid Examples:  +91-1234567890, +911234567890, 1234567890' }],
      'personEmail': [
        { type: 'email', message: 'Not a valid Email address.' }],
    };
  }

  isError(name: string, validationType: string): boolean {
    return this.itemDetailsFormGroup.get(name).hasError(validationType) && (this.itemDetailsFormGroup.get(name).dirty || this.itemDetailsFormGroup.get(name).touched)
  }

  onImportanceChange(event: any) {
    this.importance = event.detail.value;
    this.itemDetailsFormGroup.markAsTouched();
    this.itemDetailsFormGroup.markAsDirty();
    console.log(this.importance);
  }

  async confirmCancelEditing() {
    if (this.itemDetailsFormGroup.touched && this.itemDetailsFormGroup.dirty) {
      const alert = await this._alertController.create({
        header: 'Confirm Cancel',
        message: 'There are unsaved changes. The changes will be lost upon confirmation. Do you still want to continue?',
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Yes',
            handler: () => {
              this.itemDetailsFormGroup.markAsUntouched();
              this.prePopulateValues();
              this.editing = !this.editing;
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.editing = !this.editing;
    }
  }

  async confirmUpdateDetails() {
    if (this.itemDetailsFormGroup.touched && this.itemDetailsFormGroup.dirty) {
      const alert = await this._alertController.create({
        header: 'Confirm Update',
        message: 'This action will update the existing item details permanently. Do you want to continue?',
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Yes',
            handler: () => {
              this.updateItemDetails();
              this.editing = !this.editing;
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.editing = !this.editing;
    }
  }

  updateItemDetails() {
    const modifiedItem: Item = this.itemDetailsFormGroup.value;
    modifiedItem.importance = this.importance;
    const resultantItem = Object.assign({}, this.itemObject, modifiedItem);
    console.log(this.itemObject, this.itemDetailsFormGroup.value, resultantItem);
    this._loader.presentLoader().then(() => {
      this._itemService.updateItem(this.itemId, resultantItem).then(response => {
        this._toastManager.showToast(BorrowedAppConstants.ITEM_UPDATE_DETAILS_SUCCESS_MESSAGE);
      }).catch(error => {
        this._toastManager.showErrorToast(error);
      }).finally(() => {
        this._loader.stopLoader();
      });
    });
  }

  prePopulateValues() {
    if (this.itemObject.expectedReturnDate) {
      this.itemDetailsFormGroup.get('expectedReturnDate').setValue(this.itemObject.expectedReturnDate);
    }
    if (this.itemObject.itemDescription) {
      this.itemDetailsFormGroup.get('itemDescription').setValue(this.itemObject.itemDescription);
    }
    if (this.itemObject.personContactNumber) {
      this.itemDetailsFormGroup.get('personContactNumber').setValue(this.itemObject.personContactNumber);
    }
    if (this.itemObject.personEmail) {
      this.itemDetailsFormGroup.get('personEmail').setValue(this.itemObject.personEmail);
    }
    this.itemDetailsFormGroup.get('itemName').setValue(this.itemObject.itemName);
    this.itemDetailsFormGroup.get('eventDate').setValue(this.itemObject.eventDate);
    this.itemDetailsFormGroup.get('personName').setValue(this.itemObject.personName);
    this.importance = this.itemObject.importance;
  }

  ionViewDidEnter() {
    this.editing = false;
  }

  calculatePendingTime(item) {
    if (item.isActive) {
      const expectedReturnDate = new Date(item.expectedReturnDate);
      this.itemObject["status"] = this._itemService.calculatePendingTime(expectedReturnDate);
      switch (this.itemObject["status"]) {
        case "overdue":
          return "danger";
        case "urgent":
          return "warning";
        case "normal":
        default:
          return "success";
      }
    } else {
      this.itemObject["status"] = "inactive";
      return "#bbbbbb";
    }
  }

  async confirmSendingReminderWithNote(socialOption: SOCIAL_SHARE_OPTIONS) {
    const alert = await this._alertController.create({
      header: 'Include Description',
      message: 'Do you want to send your personalized item description along with the reminder?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.shareReminderViaSocialOptions(socialOption, false);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.shareReminderViaSocialOptions(socialOption, true);
          }
        }
      ]
    });
    await alert.present();
  }

  shareReminderViaSocialOptions(socialOption: SOCIAL_SHARE_OPTIONS, includeDescription: boolean) {
    switch (socialOption) {
      case SOCIAL_SHARE_OPTIONS.WHATSAPP:
        this.sendReminderOnWhatsapp(includeDescription);
        break;
      case SOCIAL_SHARE_OPTIONS.FACEBOOK:
        this.sendReminderOnFacebook(includeDescription);
        break;
      case SOCIAL_SHARE_OPTIONS.INSTAGRAM:
        this.sendReminderOnInstagram(includeDescription);
        break;
      case SOCIAL_SHARE_OPTIONS.TWITTER:
        this.sendReminderOnTwitter(includeDescription);
        break;
      case SOCIAL_SHARE_OPTIONS.EMAIL:
        this.sendReminderOnEmail(includeDescription);
        break;
      default:
        this.sendReminder(includeDescription);
    }
  }

  sendReminderOnWhatsapp(includeDescription: boolean) {
    const attr: WhatsAppAttributes = {
      message: this.constructMessage(includeDescription),
      image: this.getItemImage(),
    };
    this._socialNetworksService.shareToWhatsApp(attr);
  }

  sendReminderOnFacebook(includeDescription: boolean) {
    const attr: FacebookAttributes = {
      message: this.constructMessage(includeDescription),
      image: this.getItemImage()
    };
    this._socialNetworksService.shareToFacebook(attr);
  }

  sendReminderOnInstagram(includeDescription: boolean) {
    const attr: InstagramAttributes = {
      message: this.constructMessage(includeDescription),
      image: this.getItemImage(),
    };
    this._socialNetworksService.shareToInstagram(attr);
  }

  sendReminderOnTwitter(includeDescription: boolean) {
    const attr: TwitterAttributes = {
      message: this.constructMessage(includeDescription),
      image: this.getItemImage(),
    };
    this._socialNetworksService.shareToTwitter(attr);
  }

  sendReminder(includeDescription: boolean) {
    const attr: GenericShare = {
      subject: this.constructSubject(),
      message: this.constructMessage(includeDescription),
    };
    this._socialNetworksService.share(attr);
  }

  sendReminderOnEmail(includeDescription: boolean) {
    const toEmail = this.itemObject.lendeeEmail ? [this.itemObject.lendeeEmail] : [];
    const attr: EmailAttributes = {
      subject: this.constructSubject(),
      message: this.constructMessage(includeDescription),
      to: toEmail,
      cc: [],
      bcc: []
    };
    this._socialNetworksService.sendEmail(attr);
  }

  constructSubject(): string {
    return "Reminder for \"" + this.itemObject.itemName + "\"";
  }

  constructMessage(includeDescription: boolean): string {
    let message = "Hi " + this.itemObject.lendeeName + ", It's been a while since We last discussed about \"" + this.itemObject.itemName + "\". The borrowing day was " + this._datePipe.transform(this.itemObject.borrowingDate, 'EEEE, dd MMMM yyyy') + ".";
    if (includeDescription && this.itemObject.itemDescription) {
      message = message + "My personal notes about the \"" + this.itemObject.itemName + "\" are as follows : " + this.itemObject.itemDescription + "."
    }
    return message;
  }

  getItemImage() {
    return this.itemObject.itemImage === BorrowedAppConstants.DEFAULT_ITEM_IMAGE ? null : this.itemObject.itemImage;
  }

  async selectImageSource() {
    const alert = await this._actionSheetController.create({
      buttons: [
        {
          text: "Camera",
          icon: 'camera',
          handler: () => {
            this.captureItemImage(ImageSourceType.BACK_CAMERA);
          }
        },
        {
          text: "Gallery",
          icon: 'images',
          handler: () => {
            this.captureItemImage(ImageSourceType.GALLERY);
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

  captureItemImage(sourceType: ImageSourceType) {
    this._getImageService.getImage(sourceType)
      .then((imageData) => {
        const itemImage = BorrowedAppConstants.BASE64_IMAGE_PREFIX_DATA + imageData;
        console.log("imageData", itemImage);
        //update item image
        this._loader.presentLoader().then(() => {
          this._itemService.updateItem(this.itemId, {
            itemName: this.itemObject.itemName,
            itemImage: itemImage
          }).then(response => {
            this._toastManager.showToast(BorrowedAppConstants.ITEM_IMAGE_SUCCESS_MESSAGE);
          }).catch(error => {
            this._toastManager.showErrorToast(error);
          }).finally(() => {
            this._loader.stopLoader();
          });
        });
      },
        (error) => {
          console.log("error occurred while getting Item Image: ", error);
        });
  }

  ngOnDestroy() {
    this.itemDetails$.unsubscribe();
    this.itemDetails$ = null;
  }

}
