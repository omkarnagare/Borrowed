import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LogInCredentials, GooglePlusUserInfo } from '../types';
import { Observable } from 'rxjs';
import { User, auth } from 'firebase/app';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  loader: any;

  constructor(
    private _angularFireAuth: AngularFireAuth,
    private _googlePlus: GooglePlus,
    private _toastController: ToastController,
    private _platform: Platform,
    private _loadingController: LoadingController
  ) { }

  resetPassword(email: string) {
    return this._angularFireAuth.auth.sendPasswordResetEmail(email);
  }

  async presentLoader() {
    this.loader = await this._loadingController.create({
      message: 'Connecting to the Network ...'
    });
    await this.loader.present();
  }

  async stopLoader() {
    await this.loader.dismiss();
  }

  async logInWithGooglePlus() {
    this.presentLoader();
    let params = {};
    if (this._platform.is('android')) {
      params = environment.googlePlusConfig;
    }
    return this._googlePlus.login(params)
      .then((response) => {
        const { idToken, accessToken } = response;
        this.onLoginSuccessWithGooglePlus(idToken, accessToken);
      }).catch((error) => {
        this.onLoginErrorWithGooglePlus(error);
        this.stopLoader();
      });
  }

  onLoginSuccessWithGooglePlus(accessToken: string, accessSecret: string) {
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
      .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
        .credential(accessToken);
    return this._angularFireAuth.auth.signInWithCredential(credential);
  }

  onLoginErrorWithGooglePlus(error: any) {
    console.error(error)
    this.showToast(error);
  }

  logInWithEmailAndPassword(credentials: LogInCredentials): Promise<any> {
    return this._angularFireAuth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

  logOut(): Promise<any> {
    return this._angularFireAuth.auth.signOut();
  }

  signUp(credentials: LogInCredentials): Promise<any> {
    return this._angularFireAuth.auth.createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

  getAuthState(): Observable<User | null> {
    return this._angularFireAuth.authState;
  }

  getCurrentUserId(): string {
    return this._angularFireAuth.auth.currentUser.uid;
  }

  getAuth() {
    return this._angularFireAuth.auth;
  }

  showToast(message: any) {
    const toast = this._toastController.create({
      message: message,
      duration: 4000,
      position: "bottom",
      showCloseButton: true,
      closeButtonText: "dismiss",
      color: "primary"
    });
    toast.then((toastMessage) => {
      toastMessage.present();
    });
  }

}
