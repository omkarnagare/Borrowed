import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';
import { ModalController, ToastController } from '@ionic/angular';
import { AddItemPage } from '../add-item/add-item.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  missingItems: Observable<Item[]>;

  constructor(
    private _toastController: ToastController,
    private _modalController: ModalController,
    itemsService: ItemsService
  ) {
    // simulate delay
    // setTimeout(()=> {
    //   this.missingItems = missingItemsService.getItems();
    // }, 5000);
    this.missingItems = itemsService.getItems();
  }

  ngOnInit() {

  }

  async openAddItemModal() {
    const addItemModal = await this._modalController.create({
      component: AddItemPage,
      componentProps: {
        // parameters to send to modal
      }
    });
    addItemModal.onDidDismiss().then((modalData) => {
      if (modalData.data) {
        console.log("Item Added: ", modalData.data);
        this.showToast(modalData.data);
      } else {
        console.log("Modal dissmissed without adding any item");
      }
    });
    return addItemModal.present();
  }

  showToast(itemDetails: Item) {
    const toast = this._toastController.create({
      message: "Item " + itemDetails.itemName + " added successfully",
      duration: 2000,
      position: "bottom"
    });
    toast.then((toastMessage) => {
      toastMessage.present();
    });
  }

}
