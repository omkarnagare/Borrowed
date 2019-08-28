import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Item } from '../types';
import { ItemsService } from '../services/items.service';
import { Platform } from '@ionic/angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-borrowed',
  templateUrl: 'borrowed.page.html',
  styleUrls: ['borrowed.page.scss']
})
export class BorrowedPage implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription$: Subscription;

  lentItems: Observable<Item[]>;
  lentItems$: Subscription;

  searchFromGroup: FormGroup;
  searching: boolean;
  enableSearchBar: boolean;

  constructor(
    private _splashScreen: SplashScreen,
    private _platform: Platform,
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
    this._splashScreen.hide();
    this.searching = true;
    this.searchFromGroup.get("searchControl").setValue("");
  }

  ngAfterViewInit() {
    this.backButtonSubscription$ = this._platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription$.unsubscribe();
    this.lentItems$.unsubscribe();
    this.lentItems$ = null;
    this.lentItems = null;
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
    this.lentItems$ = this.lentItems.subscribe(data => {
      console.log(data);
    });
  }

  onSearchInput() {
    this.searching = true;
  }

  removeItem(item: Item) {
    this._itemsService.remove(item);
  }

  toggleUrgentStatus(id: string, lentItem: Item) {
    this._itemsService.presentLoader().then(() => {
      lentItem.isUrgent = !lentItem.isUrgent;
      this._itemsService.updateItem(id, lentItem).then((result) => {
        const message = lentItem.isUrgent
          ? "Item \"" + lentItem.itemName + "\" added to urgent List"
          : "Item \"" + lentItem.itemName + "\" removed from urgent List"
        this._itemsService.showToast(message);
      }).catch((error) => {
        this._itemsService.showToast(error);
      }).finally(() => {
        this._itemsService.stopLoader();
      });
    });
  }

  toggleFiltering() {
    this.enableSearchBar = !this.enableSearchBar;
    if (!this.enableSearchBar) {
      this.searching = true;
      this.searchFromGroup.get("searchControl").setValue("");
    }
  }

}
