import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LogInCredentials, SocialUserInfo } from '../types';
import { Observable } from 'rxjs';
import { User, auth } from 'firebase/app';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { TwitterConnect } from '@ionic-native/twitter-connect/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  loader: any = null;

  constructor(
    private _angularFireAuth: AngularFireAuth,
    private _googlePlus: GooglePlus,
    private _facebook: Facebook,
    private _twitter: TwitterConnect,
    private _toastController: ToastController,
    private _platform: Platform,
    private _loadingController: LoadingController
  ) { }

  resetPassword(email: string) {
    return this._angularFireAuth.auth.sendPasswordResetEmail(email);
  }

  async presentLoader() {
    if (!this.loader) {
      this.loader = await this._loadingController.create({
        message: 'Processing your request ...'
      });
      await this.loader.present();
    }
  }

  async stopLoader() {
    if (this.loader) {
      await this.loader.dismiss();
      this.loader = null;
    }
  }

  async logInWithFacebook() {
    this.presentLoader();
    return this._facebook.login(['email'])
      .then((response: FacebookLoginResponse) => {
        this.onLoginSuccessForFacebook(response);
        console.log(response.authResponse.accessToken);
      }).catch((error) => {
        this.onLoginError(error);
      });
  }

  onLoginSuccessForFacebook(response: any) {
    const credential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
    return this._angularFireAuth.auth.signInWithCredential(credential);
  }

  async logInWithTwitter() {
    this.presentLoader();
    return this._twitter.login()
      .then((response) => {
        this.onLoginSuccessWithTwitter(response);
      }).catch((error) => {
        this.onLoginError(error);
      });
  }

  onLoginSuccessWithTwitter(response: any) {
    const { token, secret } = response;
    const credential = firebase.auth.TwitterAuthProvider.credential(token, secret);
    return this._angularFireAuth.auth.signInWithCredential(credential);
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
        this.onLoginError(error);
      });
  }

  onLoginSuccessWithGooglePlus(accessToken: string, accessSecret: string) {
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
      .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
        .credential(accessToken);
    return this._angularFireAuth.auth.signInWithCredential(credential);
  }

  onLoginError(error: any) {
    console.error(error)
    this.showToast(error);
    this.stopLoader();
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

  showToast(message: any, duration = 2000) {
    const toast = this._toastController.create({
      message: message,
      duration: duration,
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
