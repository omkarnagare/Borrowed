import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LogInCredentials } from '../types';
import { Observable } from 'rxjs';
import { User, auth } from 'firebase/app';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private _angularFireAuth: AngularFireAuth,
    private _toastController: ToastController
  ) { }

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
