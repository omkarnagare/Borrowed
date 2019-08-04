import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';
import { ActivatedRoute } from '@angular/router';
import { BorrowedAppConstants } from '../constants';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
})
export class ItemDetailsPage implements OnInit {

  itemId: string;
  itemObject: Item;

  itemDetails: Observable<Item>;

  constructor(
    private _itemService: ItemsService,
    activatedRoute: ActivatedRoute
  ) {
    this.itemId = activatedRoute.snapshot.params["itemId"];
    this.itemDetails = _itemService.getItem(this.itemId);
    this.itemDetails.subscribe((item) => {
      console.log("item details", item);
      this.itemObject = item;
    })
  }

  ngOnInit() {
  }

  toggleUrgentStatus() {
    this.itemObject.isUrgent = !this.itemObject.isUrgent;
    this._itemService.updateItem(this.itemId, this.itemObject).then((result) => {
      const message = this.itemObject.isUrgent
        ? "Item " + this.itemObject.itemName + " added to urgent List"
        : "Item " + this.itemObject.itemName + " removed from urgent List"
      this._itemService.showToast(message);
    }).catch((error) => {
      this._itemService.showToast(error);
    });
  }

}
