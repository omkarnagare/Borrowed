import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LogInCredentials } from '../types';

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  constructor(
    private _angularFireAuth: AngularFireAuth
  ) { }

  logIn(credentials: LogInCredentials): Promise<any> {
    return this._angularFireAuth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

}
