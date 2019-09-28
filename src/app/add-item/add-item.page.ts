import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemsService } from '../services/items.service';
import { BorrowedAppConstants, ImageSourceType } from '../constants';
import { Item } from '../types';
import { GetImageService } from '../services/get-image.service';
import { PlatformInfoService } from '../services/platform-info.service';
import { ContactsService } from '../services/contacts.service';
import { Router } from '@angular/router';
import { LoaderManagerService } from '../services/loader-manager.service';
import { ToastManagerService } from '../services/toast-manager.service';
import { AdmobAdsService } from '../services/admob-ads.service';

import { trigger, state, transition, style, animate } from '@angular/animations';
import { ContactFinderPage } from '../contact-finder/contact-finder.page';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
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
export class AddItemPage implements OnInit {

  showItemDetailsForm: boolean = false;

  itemDetailsFormGroup: FormGroup;
  validationMessages: any;
  itemImage: any;

  isMobilePlatform: boolean = false;

  today: any;

  transactionType: string;
  importance: string;

  constructor(
    private _itemService: ItemsService,
    private _loader: LoaderManagerService,
    private _toastManager: ToastManagerService,
    private _getImageService: GetImageService,
    private _platformInfoService: PlatformInfoService,
    private _actionSheetController: ActionSheetController,
    private _modalController: ModalController,
    private _router: Router,
    formBuilder: FormBuilder
  ) {
    this.today = new Date().toISOString();
    this.isMobilePlatform = this._platformInfoService.isMobilePlatform();
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

  onTransactionTypeChange(event: any) {
    this.transactionType = event.detail.value;
    console.log(this.transactionType);
  }

  onImportanceChange(event: any) {
    this.importance = event.detail.value;
    console.log(this.importance);
  }

  isError(name: string, validationType: string): boolean {
    return this.itemDetailsFormGroup.get(name).hasError(validationType) && (this.itemDetailsFormGroup.get(name).dirty || this.itemDetailsFormGroup.get(name).touched)
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.showItemDetailsForm = true;
    this.resetForm();
  }

  ionViewWillLeave() {
    this.showItemDetailsForm = false;
  }

  resetForm() {
    this.itemImage = null;
    this.itemDetailsFormGroup.reset();
    this.itemDetailsFormGroup.markAsUntouched();
  }

  async openContactFinderModal() {
    const pinModal = await this._modalController.create({
      component: ContactFinderPage,
      backdropDismiss: false
    });

    pinModal.onDidDismiss()
      .then((data) => {
        const response = data.data;
        if (response) {
          console.log(response);
          this.assignContactDetails(response.contactName, response.contactNumber);
        } else {
          // no need to take any action
        }
      });
    return await pinModal.present();
  }

  assignContactDetails(contact: any, number: any) {
    const trimmedName = contact.displayName.trim(); // trim whitespaces from name
    this.itemDetailsFormGroup.get("personName").setValue(trimmedName);
    const trimmedNumber = number.replace(/\s/g, ""); // remove all the whitespaces from number
    this.itemDetailsFormGroup.get("personContactNumber").setValue(trimmedNumber);

    this.itemDetailsFormGroup.get("personName").markAsTouched();
    this.itemDetailsFormGroup.get("personContactNumber").markAsTouched();
  }

  async selectImageSource() {
    const alert = await this._actionSheetController.create({
      buttons: [
        {
          text: "Camera",
          icon: 'camera',
          handler: () => {
            this.getItemImage(ImageSourceType.BACK_CAMERA);
          }
        },
        {
          text: "Gallery",
          icon: 'images',
          handler: () => {
            this.getItemImage(ImageSourceType.GALLERY);
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

  getItemImage(sourceType: ImageSourceType) {
    this._getImageService.getImage(sourceType)
      .then((imageData) => {
        this.itemImage = BorrowedAppConstants.BASE64_IMAGE_PREFIX_DATA + imageData;
        console.log("imageData", this.itemImage);
      },
        (error) => {
          console.log("error occurred while getting Item Image: ", error);
        });
  }

  addItem() {
    this._loader.presentLoader().then(() => {
      const itemObject: Item = this.preProcessingItemOject(this.itemDetailsFormGroup.value);
      this._itemService
        .addItem(itemObject)
        .then((result) => {
          this._toastManager.showToast("Item " + itemObject.itemName + " added successfully.");
          this.redirectToHomePage();
        }).catch((error) => {
          this._toastManager.showErrorToast(error);
        }).finally(() => {
          this._loader.stopLoader();
        });
    });
  }

  preProcessingItemOject(value: any): Item {
    const itemObject: Item = { ...value };
    if (!itemObject.expectedReturnDate) {
      itemObject.expectedReturnDate = this._itemService.getDateOfOneMonthLater(itemObject.eventDate);
    }
    itemObject["itemImage"] = this.itemImage ? this.itemImage : BorrowedAppConstants.DEFAULT_ITEM_IMAGE;
    itemObject.transactionType = this.transactionType;
    itemObject.importance = this.importance;
    console.log("item :", itemObject);
    return itemObject;
  }

  redirectToHomePage() {
    this._router.navigate(["/"]);
  }

}
