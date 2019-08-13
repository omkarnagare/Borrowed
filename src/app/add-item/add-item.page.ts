import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemsService } from '../services/items.service';
import { BorrowedAppConstants, ImageSourceType } from '../constants';
import { Item } from '../types';
import { GetImageService } from '../services/get-image.service';
import { PlatformInfoService } from '../services/platform-info.service';
import { ContactsService } from '../services/contacts.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  itemDetailsFormGroup: FormGroup;
  itemImage: any;

  showSearchBarForContacts: boolean = false;
  contactsFound: any;

  constructor(
    private _itemService: ItemsService,
    private _getImageService: GetImageService,
    private _platformInfoService: PlatformInfoService,
    private _contactsService: ContactsService,
    private _modalController: ModalController,
    private _actionSheetController: ActionSheetController,

    formBuilder: FormBuilder
  ) {

    this.showSearchBarForContacts = this._platformInfoService.isMobilePlatform();
    this.itemDetailsFormGroup = formBuilder.group({
      // item related
      itemName: ["", [Validators.required]],
      itemDescription: "",
      borrowingDate: ["", [Validators.required]],
      isUrgent: false,
      lendeeName: ["", [Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")]],
      lendeeContact: ["", [Validators.pattern("^[+]*[ (]{0,1}[0-9 ]{1,4}[) ]{0,1}[-\s\./0-9 ]*$")]],
      lendeeEmail: ["", [Validators.email]],
      // query related
      searchQuery: ""
    });

  }

  ngOnInit() {
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

  assignContactDetails(contact, number) {
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
    const itemObject: Item = { ... this.itemDetailsFormGroup.value };
    itemObject["itemImage"] = this.itemImage ? this.itemImage : "/assets/unknown-item.svg";

    this._itemService
      .addItem(itemObject)
      .then((result) => {
        this._itemService.showToast("Item " + itemObject.itemName + " added successfully.");
        this._modalController.dismiss(itemObject);
      }).catch((error) => {
        this._itemService.showToast(error);
        this._modalController.dismiss();
      });
  }

  closeModal() {
    this._modalController.dismiss();
  }

}
