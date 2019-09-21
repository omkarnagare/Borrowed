import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from './users.service';
import { Observable, Subscription } from 'rxjs';
import { PinModalData } from '../types';

@Injectable({
  providedIn: 'root'
})
export class PinVerificationService implements OnInit, OnDestroy{

  userProfileFetched:boolean = false; // one time variable
  verified: boolean = false; // status of pin verification
  pin: string = ""; // current pin

  storedUserProfile: Observable<any>;

  constructor(
    private _usersService: UsersService
  ) { 
    this.storedUserProfile = this._usersService.getUserProfile();
  }

  isVerified(): Promise<PinModalData> {
    return new Promise((resolve, reject) => {
      if (this.userProfileFetched) {
        resolve({
          pin: this.pin,
          verified: this.verified
        });
      } else {
        this.storedUserProfile.subscribe(userProfile => {
          if (userProfile) {
            if (userProfile.pin) {
              this.verified = false;
              this.pin = userProfile.pin;
            } else {
              this.verified = true;
            }
            this.userProfileFetched = true;
            resolve({
              pin: this.pin,
              verified: this.verified
            });
          }
        });
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.storedUserProfile = null;
  }
}
