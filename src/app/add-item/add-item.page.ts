import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ActionSheetController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemsService } from '../services/items.service';
import { BorrowedAppConstants, ImageSourceType } from '../constants';
import { Item } from '../types';
import { GetImageService } from '../services/get-image.service';
import { CloudFilesStorageService } from '../services/cloud-files-storage.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  itemDetailsFormGroup: FormGroup;

  itemImage: any;

  constructor(
    private _itemService: ItemsService,
    private _getImageService: GetImageService,
    private _modalController: ModalController,
    private _actionSheetController: ActionSheetController,
    navParams: NavParams,
    formBuilder: FormBuilder
  ) {

    this.itemDetailsFormGroup = formBuilder.group({
      itemName: ["", [Validators.required]],
      itemDescription: "",
      dateBorrowed: ["", [Validators.required]],
      isUrgent: false,
    });

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
    itemObject["itemImage"] = this.itemImage ? this.itemImage: "/assets/shapes.svg";

    this._itemService
      .addItem(itemObject)
      .then((result) => {
        this._itemService.showToast("Item "+ itemObject.itemName + " added successfully.");
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
