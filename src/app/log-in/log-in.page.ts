import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LogInCredentials } from '../types';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { ToastController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription$;

  logInFormGroup: FormGroup;

  constructor(
    private _platform: Platform,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    formBuilder: FormBuilder
  ) {
    this.logInFormGroup = formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    });
  }

  ngOnInit() {
    // TODO: test email
    this.logInFormGroup.get('email').setValue("omkar.nagare@borrowed.com");
  }

  ngAfterViewInit() {
    this.backButtonSubscription$ = this._platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }
 
  ngOnDestroy() {
    this.backButtonSubscription$.unsubscribe();
  }

  logIn() {
    const credentials: LogInCredentials = this.logInFormGroup.value;
    this._authenticationService.logIn(credentials)
      .then((authData) => {
        // console.log(authData);
        this._router.navigate(["/tabs"]);
      }).catch((authDataError) => {
        console.log("Auth Error :", authDataError)
        this._authenticationService.showToast(authDataError);
      });
  }

  signUp() {
    const credentials: LogInCredentials = this.logInFormGroup.value;
    this._authenticationService.signUp(credentials)
      .then((authData) => {
        // console.log(authData);
        this._router.navigate(["/tabs"]);
      }).catch((authDataError) => {
        console.log("Auth Error :", authDataError);
        this._authenticationService.showToast(authDataError);
      });
  }

}
