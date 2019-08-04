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
  missingItemDetails: Observable<Item>;

  constructor(
    private _toastController: ToastController,
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

  addToUrgentItems(){
    // this.missingItemDetails.subscribe(
    //   (itemDetails) => {
    //     this._angularFirestore.collection(BorrowedAppConstants.ITEMS_COLLECTION)
    //     .doc(this._angularFireAuth.auth.currentUser.uid)
    //     .collection (BorrowedAppConstants.ITEMS_COLLECTION , (ref) => {
    //       return ref.where("id", "==", itemDetails.itemId)
    //     })
    //     .get()
    //     .subscribe((doc) => {
    //       if (doc.empty){
    //         this._angularFirestore.collection(BorrowedAppConstants.ITEMS_COLLECTION)
    //         .doc(this._angularFireAuth.auth.currentUser.uid)
    //         .collection(BorrowedAppConstants.ITEMS_COLLECTION)
    //         .add(itemDetails)
    //         .then(() => {
    //           const toast = this._toastController.create({
    //             message: "Test toast notification",
    //             duration: 2000,
    //             position: "bottom"
    //           });
    //           toast.then((toastMessage) => {
    //             toastMessage.present();
    //           });
    //         });
    //       }
    //     });
    // });
  }

}
