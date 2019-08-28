import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Item, WhatsAppAttributes, EmailAttributes, FacebookAttributes, InstagramAttributes, TwitterAttributes, GenericShare } from '../types';
import { ItemsService } from '../services/items.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialNetworksService } from '../services/social-networks.service';
import { DatePipe } from '@angular/common';
import { PlatformInfoService } from '../services/platform-info.service';
import { FormBuilder } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
})
export class ItemDetailsPage implements OnDestroy {

  itemId: string;
  itemObject: Item;
  itemDetails$: Subscription;

  isMobilePlatform: boolean = false;

  constructor(
    private _itemService: ItemsService,
    private _socialNetworksService: SocialNetworksService,
    private _platformInfoService: PlatformInfoService,
    private _datePipe: DatePipe,
    private _router: Router,
    activatedRoute: ActivatedRoute
  ) {
    this.isMobilePlatform = this._platformInfoService.isMobilePlatform();

    this.itemObject = {
      itemName: "",
      borrowingDate: "",
      isUrgent: false,
      isActive: true
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
    this._itemService.presentLoader().then(() => {
      this.itemObject.isUrgent = !this.itemObject.isUrgent;
      this._itemService.updateItem(this.itemId, { isUrgent: this.itemObject.isUrgent }).then((result) => {
        const message = this.itemObject.isUrgent
          ? "Item \"" + this.itemObject.itemName + "\" added to urgent List"
          : "Item \"" + this.itemObject.itemName + "\" removed from urgent List"
        this._itemService.showToast(message);
      }).catch((error) => {
        this._itemService.showToast(error);
      }).finally(() => {
        this._itemService.stopLoader();
      });
    });
  }

  sendReminderOnWhatsapp() {
    const attr: WhatsAppAttributes = {
      message: this.constructMessage(),
      image: this.itemObject.itemImage,
      // url: ""
    };
    this._socialNetworksService.shareToWhatsApp(attr);
  }

  sendReminderOnFacebook() {
    const attr: FacebookAttributes = {
      message: this.constructMessage(),
      image: this.itemObject.itemImage,
      // url: ""
    };
    this._socialNetworksService.shareToFacebook(attr);
  }

  sendReminderOnInstagram() {
    const attr: InstagramAttributes = {
      message: this.constructMessage(),
      image: this.itemObject.itemImage,
    };
    this._socialNetworksService.shareToInstagram(attr);
  }

  sendReminderOnTwitter() {
    const attr: TwitterAttributes = {
      message: this.constructMessage(),
      image: this.itemObject.itemImage,
      // url: ""
    };
    this._socialNetworksService.shareToTwitter(attr);
  }

  sendReminder() {
    const attr: GenericShare = {
      subject: this.constructSubject(),
      message: this.constructMessage(),
    };
    this._socialNetworksService.share(attr);
  }

  sendReminderOnEmail() {
    const attr: EmailAttributes = {
      subject: this.constructSubject(),
      message: this.constructMessage(),
      to: [this.itemObject.lendeeEmail],
      cc: [],
      bcc: [],
      // files: this.itemObject.itemImage
    };
    this._socialNetworksService.sendEmail(attr);
  }

  constructSubject(): string {
    return "Reminder for \"" + this.itemObject.itemName + "\"";
  }

  constructMessage(): string {
    return "Hi " + this.itemObject.lendeeName + ", It's been a while that We have discussed about \"" + this.itemObject.itemName + "\". The borrowing date was " + this._datePipe.transform(this.itemObject.borrowingDate, 'dd MMM yyyy') + ". Please try to return it as soon as possible.";
  }

  ngOnDestroy() {
    this.itemDetails$.unsubscribe();
    this.itemDetails$ = null;
  }

}
