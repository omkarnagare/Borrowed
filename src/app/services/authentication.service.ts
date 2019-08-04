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

  logIn(credentials: LogInCredentials): Promise<any> {
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

  showToast(errorMessage: string) {
    const toast = this._toastController.create({
      message: errorMessage,
      duration: 4000,
      position: "top"
    });
    toast.then((toastMessage) => {
      toastMessage.present();
    });
  }

}
