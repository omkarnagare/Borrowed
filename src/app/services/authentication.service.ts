import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LogInCredentials } from '../types';
import { Observable } from 'rxjs';
import { User, auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private _angularFireAuth: AngularFireAuth
  ) { }

  logIn(credentials: LogInCredentials): Promise<any> {
    return this._angularFireAuth.auth.signInWithEmailAndPassword(
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

}
