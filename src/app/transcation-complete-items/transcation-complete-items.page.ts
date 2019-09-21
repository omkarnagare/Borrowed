import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';

import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-transcation-complete-items',
  templateUrl: './transcation-complete-items.page.html',
  styleUrls: ['./transcation-complete-items.page.scss'],
  animations: [
    trigger('fadein', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slidelefttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }, ))
      ])
    ]),
    trigger('sliderighttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }, ))
      ])
    ]),
    trigger('slidetoptitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }, ))
      ])
    ]),
    trigger('slidebottomtitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }, ))
      ])
    ])
  ]
})
export class TranscationCompleteItemsPage implements OnInit, OnDestroy {

  transcationCompleteItems: Observable<Item[]>;
  transcationCompleteItems$: Subscription;

  constructor(
    private _itemsService: ItemsService
  ) {
  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.transcationCompleteItems = this._itemsService.getTransactionCompleteItems();
    this.transcationCompleteItems$ = this.transcationCompleteItems.subscribe((data) => {
      console.log("urgent items: ", data);
    });
  }

  removeItem(item: Item) {
    this._itemsService.remove(item);
  }

  ngOnDestroy() {
    this.transcationCompleteItems$.unsubscribe();
    this.transcationCompleteItems$ = null;
    this.transcationCompleteItems = null;
  }

}
