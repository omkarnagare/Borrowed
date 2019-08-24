import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Item, WhatsAppAttributes, EmailAttributes } from '../types';
import { ItemsService } from '../services/items.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialNetworksService } from '../services/social-networks.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
})
export class ItemDetailsPage implements OnDestroy {

  itemId: string;
  itemObject: Item;

  parentURL: string;

  itemDetails$: Subscription;

  constructor(
    private _itemService: ItemsService,
    private _socialNetworksService: SocialNetworksService,
    private _router: Router,
    activatedRoute: ActivatedRoute
  ) {
    this.itemObject = {
      itemName: "",
      borrowingDate: "",
      isUrgent: false
    }
    this.itemId = activatedRoute.snapshot.params["itemId"];
    this.itemDetails$ = this._itemService.getItem(this.itemId)
      .subscribe((item) => {
        console.log("item details", item);
        if (item) {
          this.itemObject = item;
        }
      });
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

  sendNotificationOnWhatsapp() {
    const attr: WhatsAppAttributes = {
      message: this.constructMessage(),
      image: this.itemObject.itemImage,
      // url: ""
    };
    this._socialNetworksService.shareToWhatsApp(attr);
  }

  sendNotificationOnEmail() {
    const attr: EmailAttributes = {
      subject: "Borrowed: Reminder for returning "+ this.itemObject.itemName,
      message: this.constructMessage(),
      to: [this.itemObject.lendeeEmail],
      cc: [],
      bcc: [],
      // files: this.itemObject.itemImage
    };
    this._socialNetworksService.sendEmail(attr);
  }

  constructMessage(): string{
    return "Hi "+ this.itemObject.lendeeName + ",\
    I have lent you "+ this.itemObject.itemName + " on " + this.itemObject.borrowingDate + ".\
    Please try to return it as soon as possible.";
  }

  ngOnDestroy() {
    this.itemDetails$.unsubscribe();
    this.itemDetails$ = null;
  }

}
