import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { BorrowedAppConstants, PIN_STATE } from '../constants';
import { ToastManagerService } from '../services/toast-manager.service';

@Component({
  selector: 'app-pin-unlock',
  templateUrl: './pin-unlock.page.html',
  styleUrls: ['./pin-unlock.page.scss'],
})
export class PinUnlockPage implements OnInit {

  title: string;
  pinSetupState: PIN_STATE;
  pin: string = "";
  expectedPin: string = "";

  pinFieldsClass: string = "";
  pin1Class: string = "";
  pin2Class: string = "";
  pin3Class: string = "";
  pin4Class: string = "";

  constructor(
    private _navParams: NavParams,
    private _modalController: ModalController,
    private _toastManager: ToastManagerService
  ) {
    // set expected pin here
    this.title = this._navParams.get(BorrowedAppConstants.PIN_MODAL_TITLE_KEY);
    this.expectedPin = this._navParams.get(BorrowedAppConstants.EXPECTED_PIN_KEY);
    this.pinSetupState = this._navParams.get(BorrowedAppConstants.PIN_SET_UP_STATE_KEY);
  }

  ngOnInit() {
  }

  add(pinNumber: string) {
    this.pin = this.pin + pinNumber;
    const length = this.pin.length;
    if (length === 1) {
      this.pin1Class = "active";
    } else if (length === 2) {
      this.pin2Class = "active";
    } else if (length === 3) {
      this.pin3Class = "active";
    } else if (length === 4) {

      if (this.pinSetupState === PIN_STATE.SET_PIN) {

        if (this.expectedPin) {
          if (this.expectedPin === this.pin) {
            // dismissModal
            this._modalController.dismiss({
              pin: this.pin,
              pinSetupState: PIN_STATE.SET_PIN
            });
          } else {
            this.title = "Enter PIN";
            this.expectedPin = "";
            this.clearPin();
          }
        } else {
          this.expectedPin = this.pin;
          this.title = "Re-Enter PIN";
          this.resetPin();
        }

      } else if (this.pinSetupState === PIN_STATE.CHANGE_PIN) {

      } else if (this.pinSetupState === PIN_STATE.VERIFY_PIN) {

      }

    } else if (length > 4) {
      this.showAnimation();
      this.pin = this.pin.substring(0, 4);
    }
  }

  delete() {
    const length = this.pin.length;
    if (length === 0) {
      this.showAnimation();
    } else if (length === 1) {
      this.resetPin();
    } else {
      if (length === 2) {
        this.pin2Class = "";
      } else if (length === 3) {
        this.pin3Class = "";
      } else if (length === 4) {
        this.pin4Class = "";
      }
      this.pin = this.pin.substring(0, length - 1);
    }
  }

  clearPin() {
    this.resetPin();
    this.showAnimation();
  }

  resetPin() {
    this.pin1Class = "";
    this.pin2Class = "";
    this.pin3Class = "";
    this.pin4Class = "";
    this.pin = "";
  }

  showAnimation() {
    this.pinFieldsClass = "miss";
    setTimeout(() => {
      this.pinFieldsClass = "";
    }, 200);
  }

  dismissModal () {
    this._modalController.dismiss();
  }

}
