import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LogInCredentials } from '../types';
import { Observable } from 'rxjs';
import { User } from 'firebase/app';
import { Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { TwitterConnect } from '@ionic-native/twitter-connect/ngx';
import { LoaderManagerService } from './loader-manager.service';
import { ToastManagerService } from './toast-manager.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private _angularFireAuth: AngularFireAuth,
    private _googlePlus: GooglePlus,
    private _facebook: Facebook,
    private _twitter: TwitterConnect,
    private _platform: Platform,
    private _loader: LoaderManagerService,
    private _toastManager: ToastManagerService
  ) { }

  resetPassword(email: string) {
    return this._angularFireAuth.auth.sendPasswordResetEmail(email);
  }

  async logInWithFacebook() {
    this._loader.presentLoader().then(() => {
      return this._facebook.login(['email'])
        .then((response: FacebookLoginResponse) => {
          console.log(response);
          this.onLoginSuccessForFacebook(response);
          console.log(response.authResponse.accessToken);
        }).catch((error) => {
          this.onLoginError(error);
        });
    });
  }

  onLoginSuccessForFacebook(response: any) {
    const credential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
    return this._angularFireAuth.auth.signInWithCredential(credential);
  }

  async logInWithTwitter() {
    this._loader.presentLoader().then(() => {
      return this._twitter.login()
        .then((response) => {
          console.log(response);
          this.onLoginSuccessWithTwitter(response);
        }).catch((error) => {
          this.onLoginError(error);
        });
    });
  }

  onLoginSuccessWithTwitter(response: any) {
    const { token, secret } = response;
    const credential = firebase.auth.TwitterAuthProvider.credential(token, secret);
    return this._angularFireAuth.auth.signInWithCredential(credential);
  }

  async logInWithGooglePlus() {
    let params = {};
    if (this._platform.is('android')) {
      params = environment.googlePlusConfig;
    }
    this._loader.presentLoader().then(() => {
      return this._googlePlus.login(params)
        .then((response) => {
          console.log(response);
          const { idToken, accessToken } = response;
          this.onLoginSuccessWithGooglePlus(idToken, accessToken);
        }).catch((error) => {
          this.onLoginError(error);
        });
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
    this._toastManager.showErrorToast(error);
    this._loader.stopLoader();
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

}
