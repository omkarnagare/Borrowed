import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';
import { ModalController, ToastController } from '@ionic/angular';
import { AddItemPage } from '../add-item/add-item.page';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  missingItems: Observable<Item[]>;

  constructor(
    private _router: Router,
    private _toastController: ToastController,
    private _modalController: ModalController,
    private _itemsService: ItemsService,
    private _authenticationService: AuthenticationService
  ) {
    // simulate delay
    // setTimeout(()=> {
    //   this.missingItems = missingItemsService.getItems();
    // }, 5000);

    this.missingItems = this._itemsService.getItems();
    this.missingItems.subscribe((data) => {
      console.log("item list: ", data);
    });
  }

  ngOnInit() {
  }

  removeItem(id: string) {
    this._itemsService.deleteItem(id);
  }

  toggleUrgentStatus(id: string, missingItem: Item) {
    missingItem.isUrgent = !missingItem.isUrgent;
    this._itemsService.updateItem(id, missingItem).then((result) => {
      const message = missingItem.isUrgent
        ? "Item " + missingItem.itemName + " added to urgent List"
        : "Item " + missingItem.itemName + " removed from urgent List"
      this._itemsService.showToast(message);
    }).catch((error) => {
      this._itemsService.showToast(error);
    });
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

  logOut() {
    this._authenticationService.logOut().then(() => {
      this._router.navigate(['']);
      console.log("User logged out successfully");
    }).catch((authDataError) => {
      console.log("Auth Error :", authDataError);
      this._authenticationService.showToast(authDataError);
    });
  }

}
