import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
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

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  itemDetailsFormGroup: FormGroup;
  validationMessages: any;
  itemImage: any;

  isMobilePlatform: boolean = false;
  contactsFound: any;

  today: any;

  constructor(
    private _itemService: ItemsService,
    private _admobService: AdmobAdsService,
    private _loader: LoaderManagerService,
    private _toastManager: ToastManagerService,
    private _getImageService: GetImageService,
    private _platformInfoService: PlatformInfoService,
    private _contactsService: ContactsService,
    private _actionSheetController: ActionSheetController,
    private _router: Router,
    formBuilder: FormBuilder
  ) {
    this.today = new Date().toISOString();
    this.isMobilePlatform = this._platformInfoService.isMobilePlatform();
    this.itemDetailsFormGroup = formBuilder.group({
      // item related
      itemName: ["", [Validators.required]],
      itemDescription: "",
      borrowingDate: ["", [Validators.required]],
      isUrgent: false,
      lendeeName: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")]],
      lendeeContact: ["", [Validators.pattern("^([+][0-9]{0,4}\-?)?[0-9]{10}$")]],
      lendeeEmail: ["", [Validators.email]],
      // query related
      searchQuery: ""
    });

    this.validationMessages = {
      'itemName': [{ type: 'required', message: 'Item Name/Category cannot be left blank.' }],
      'borrowingDate': [{ type: 'required', message: 'Borrowing date cannot be left blank.' }],
      'lendeeName': [
        { type: 'required', message: 'Lendee name cannot be left blank.' },
        { type: 'pattern', message: 'Not a valid name.' }],
      'lendeeContact': [
        { type: 'pattern', message: 'Valid Examples:  +91-1234567890, 1234567890' }],
      'lendeeEmail': [
        { type: 'email', message: 'Not a valid Email address.' }],
    };
  }

  isError(name: string, validationType: string): boolean {
    return this.itemDetailsFormGroup.get(name).hasError(validationType) && (this.itemDetailsFormGroup.get(name).dirty || this.itemDetailsFormGroup.get(name).touched)
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.itemDetailsFormGroup.reset();
    this.itemDetailsFormGroup.markAsUntouched();
  }

  searchForContacts() {
    const searchQuery = this.itemDetailsFormGroup.get("searchQuery").value;
    this._contactsService.getContacts(searchQuery).then(
      contacts => {
        console.log('contacts list', JSON.stringify(contacts));
        this.contactsFound = contacts;
      }
    ).catch((error) => {
      console.log(error);
    });
  }

  assignContactDetails(contact: any, number: any) {
    this.itemDetailsFormGroup.get("lendeeName").setValue(contact.displayName);
    this.itemDetailsFormGroup.get("lendeeContact").setValue(number);
    this.itemDetailsFormGroup.get("searchQuery").setValue(null);
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
      const itemObject: Item = { ... this.itemDetailsFormGroup.value };
      itemObject["itemImage"] = this.itemImage ? this.itemImage : "/assets/unknown-item.svg";
      this._itemService
        .addItem(itemObject)
        .then((result) => {
          this._toastManager.showToast("Item " + itemObject.itemName + " added successfully.");
          this._router.navigate(["/"]);
        }).catch((error) => {
          this._toastManager.showErrorToast(error);
        }).finally(() => {
          this._loader.stopLoader();
          this._admobService.showInterStitialAd();
        });
    });
  }

  redirectToHomePage() {
    this._router.navigate(["/"]);
  }

}
