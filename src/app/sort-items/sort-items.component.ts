import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

import { trigger, state, transition, style, animate } from '@angular/animations';
import { BorrowedAppConstants } from '../constants';

@Component({
  selector: 'app-sort-items',
  templateUrl: './sort-items.component.html',
  styleUrls: ['./sort-items.component.scss'],
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
export class SortItemsComponent implements OnInit {

  sortFields: any = [];
  selection: any = null;

  constructor(
    private _navParams: NavParams,
    private _popOverController: PopoverController
    ) {
      const icon = this._navParams.get(BorrowedAppConstants.SORT_POPOVER_ICON_KEY);
      if (icon) {
        this.selection = icon;
      }
  }

  dismiss() {
    this._popOverController.dismiss();
  }

  ngOnInit() {
    this.sortFields = [
      {
        label: "Item",
        icon: "cube",
        isSelected: false,
      },
      {
        label: "Event Date",
        icon: "time",
        isSelected: false,
      },
      {
        label: "Expected Date",
        icon: "hourglass",
        isSelected: false,
      },
      {
        label: "Person Name",
        icon: "person",
        isSelected: false,
      }
    ];

    if (this.selection) {
      this.sortFields.forEach(element => {
        if (element.icon === this.selection) {
          element.isSelected = true;
        }
      });
    }

  }

  applySorting() {
    if (this.selection) {
      this._popOverController.dismiss({
        icon: this.selection
      });
    } else {
      this.dismiss();
    }
  }

  reset() {
    this._popOverController.dismiss({
      icon: null
    });
  }

  selectField(sortField) {
    this.sortFields.forEach(element => {
      element.isSelected = false;
    });
    sortField.isSelected = true;
    this.selection = sortField.icon;
  }

}
