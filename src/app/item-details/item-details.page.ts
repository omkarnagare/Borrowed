import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
})
export class ItemDetailsPage implements OnInit {

  itemId: string;
  missingItemDetails: Observable<Item>;

  constructor(
    activatedRoute: ActivatedRoute,
    itemService: ItemsService) {
    this.itemId = activatedRoute.snapshot.params["itemId"];
    this.missingItemDetails = itemService.getItem(this.itemId);

    // simulate timeout
    // setTimeout(()=> {
    //   this.missingItemDetails = itemService.getItem(this.itemId);
    // }, 4000);
  }

  ngOnInit() {
  }

}
