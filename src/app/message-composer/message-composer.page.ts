import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { trigger, state, transition, style, animate } from '@angular/animations';
import { Item } from '../types';
import { BorrowedAppConstants } from '../constants';
import { Utils } from '../utils';

@Component({
  selector: 'app-message-composer',
  templateUrl: './message-composer.page.html',
  styleUrls: ['./message-composer.page.scss'],
  animations: [
    trigger('fadein', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate('600ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slidelefttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('sliderighttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('slidetoptitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ]),
    trigger('slidebottomtitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ])
  ]
})
export class MessageComposerPage implements OnInit {

  item: Item = null;
  composedMessage: string = "";

  constructor(
    private _navParams: NavParams,
    private _modalController: ModalController,
    private _utils: Utils
  ) {
    this.item = this._navParams.get(BorrowedAppConstants.MESSAGE_COMPOSER_ITEM_KEY);
    // this.composedMessage = "Hi " + this.item.personName + ", ";
    console.log(this.item);
  }

  dismiss() {
    this._modalController.dismiss();
  }

  sendComposedMessage() {
    this._modalController.dismiss(this.composedMessage.trim());
  }

  addToMessage(text: string, isDate: boolean = false) {
    if (isDate) {
      const eventDate = new Date(text);
      text = eventDate.getDate() + " " + this._utils.getMonthString(eventDate) + ", " + eventDate.getFullYear()
    }
    this.composedMessage += " " + text;
  }

  ngOnInit() {
  }

}
