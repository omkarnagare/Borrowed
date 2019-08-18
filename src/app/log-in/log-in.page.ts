import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LogInCredentials } from '../types';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription$;

  logInFormGroup: FormGroup;
  validationMessages: any;

  constructor(
    private _platform: Platform,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    formBuilder: FormBuilder
  ) {
    this.logInFormGroup = formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });

    this.validationMessages = {
      'email': [
        { type: 'required', message: 'User email cannot be left blank.' },
        { type: 'email', message: 'Not a valid Email address.' }],
      'password': [
        { type: 'minlength', message: 'Password should be atleast 6 charcters.' },
        { type: 'required', message: 'Password cannot be left blank.' }]
    };
  }

  isError(name: string, validationType: string): boolean {
    return this.logInFormGroup.get(name).hasError(validationType) && (this.logInFormGroup.get(name).dirty || this.logInFormGroup.get(name).touched)
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
