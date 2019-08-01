import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  constructor(
    navParams: NavParams,
    private _modalController: ModalController) {

    // to get parameters from parent component
    // navParams.get("parameter_name");

  }

  ngOnInit() {
  }

  closeModal() {
    this._modalController.dismiss();
  }

}
