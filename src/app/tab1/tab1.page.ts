import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';
import { ModalController, ToastController, Platform } from '@ionic/angular';
import { AddItemPage } from '../add-item/add-item.page';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription$;

  lentItems: Observable<Item[]>;

  searchFromGroup: FormGroup;
  searching: boolean;
  enableSearchBar: boolean;

  constructor(
    private _platform: Platform,
    private _toastController: ToastController,
    private _modalController: ModalController,
    private _itemsService: ItemsService,
    formBuilder: FormBuilder
  ) {
    this.searchFromGroup = formBuilder.group({
      searchControl: ""
    });
    this.searching = true;
    this.enableSearchBar = false;

    this.searchFromGroup.get("searchControl").valueChanges
      .pipe(debounceTime(700))
      .subscribe(search => {
        this.setFilteredItems(search);
      });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.setFilteredItems("");
  }

  ngAfterViewInit() {
    this.backButtonSubscription$ = this._platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription$.unsubscribe();
  }

  setFilteredItems(searchTerm: string) {
    this.lentItems = this._itemsService.getItems().pipe(
      map((data) => {
        this.searching = false;
        return data.filter(item => {
          return item.itemName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
      })
    );
  }

  onSearchInput() {
    this.searching = true;
  }

  removeItem(id: string) {
    this._itemsService.deleteItem(id);
  }

  toggleUrgentStatus(id: string, lentItem: Item) {
    lentItem.isUrgent = !lentItem.isUrgent;
    this._itemsService.updateItem(id, lentItem).then((result) => {
      const message = lentItem.isUrgent
        ? "Item " + lentItem.itemName + " added to urgent List"
        : "Item " + lentItem.itemName + " removed from urgent List"
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
        this.setFilteredItems("");
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
      position: "bottom",
      showCloseButton: true,
      closeButtonText: "dismiss"
    });
    toast.then((toastMessage) => {
      toastMessage.present();
    });
  }

  toggleFiltering() {
    this.enableSearchBar = !this.enableSearchBar;
    if (!this.enableSearchBar) {
      this.setFilteredItems("");
    }
  }

}
