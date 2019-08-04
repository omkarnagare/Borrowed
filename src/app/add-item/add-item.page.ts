import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemsService } from '../services/items.service';
import { BorrowedAppConstants, ImageSourceType } from '../constants';
import { Item } from '../types';
import { GetImageService } from '../services/get-image.service';

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
    private _alertController: AlertController,
    navParams: NavParams,
    formBuilder: FormBuilder
  ) {

    // to get parameters from parent component
    // navParams.get("parameter_name");

    this.itemImage = "/assets/shapes.svg";
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
    const alert = await this._alertController.create({
      header: "Select Source",
      message: "Add image for your Item",
      buttons: [
        {
          text: "Camera",
          handler: () => {
            this.getItemImage(ImageSourceType.CAMERA);
          }
        },
        {
          text: "Gallery",
          handler: () => {
            this.getItemImage(ImageSourceType.GALLERY);
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
    const itemObject: Item = {... this.itemDetailsFormGroup.value};
    itemObject["itemImage"] = this.itemImage;

    this._itemService
    .addItem(itemObject)
    .subscribe((result) => {
      this._modalController
      .dismiss(itemObject);
    });
  }

  closeModal() {
    this._modalController.dismiss();
  }

}
