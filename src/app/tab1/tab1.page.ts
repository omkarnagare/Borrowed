import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';
import { ModalController } from '@ionic/angular';
import { AddItemPage } from '../add-item/add-item.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  missingItems: Observable<Item[]>;

  constructor(
    private _modalController: ModalController,
    itemsService: ItemsService
    ) {
    // simulate delay
    // setTimeout(()=> {
    //   this.missingItems = missingItemsService.getItems();
    // }, 5000);
    this.missingItems = itemsService.getItems();
  }

  ngOnInit(){

  }

  async openAddItemModal(){
    const addItemModal = await this._modalController.create({
      component: AddItemPage,
      componentProps: {
        // parameters to send to modal
      }
    });
    return addItemModal.present();
  }

}
