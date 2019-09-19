import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from './users.service';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationManagerService implements OnInit, OnDestroy{

  userProfileLoaded:boolean = false;
  verified: boolean = false;

  storedUserProfile: Observable<any>;
  storedUserProfile$: Subscription;

  constructor(
    private _usersService: UsersService
  ) { 
    this.storedUserProfile = this._usersService.getUserProfile();
    this.storedUserProfile$ = this.storedUserProfile.subscribe(userProfile => {
      console.log("user pin", userProfile.pin);
      if (userProfile.pin) {
        this.verified = false;
      } else {
        this.verified = true;
      }
      this.userProfileLoaded = true;
    });
  }

  setVerified() {
    this.verified = true;
  }

  setNotVerified() {
    this.verified = false;
  }

  // isVerified(): Promise<Boolean> {
  //   return new Promise((resolve, reject) => {
  //     while (!this.userProfileLoaded) {}
  //     resolve(this.verified);
  //   });
  // }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.storedUserProfile$.unsubscribe();
    this.storedUserProfile$ = null;
    this.storedUserProfile = null;
  }
}
