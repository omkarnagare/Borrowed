import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LogInCredentials, UserInfo } from '../types';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { BorrowedAppConstants } from '../constants';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription$;

  userInfoFormGroup: FormGroup;
  validationMessages: any;

  showPassword: boolean = false;
  isSigningUp: boolean = false;

  constructor(
    private _splashScreen: SplashScreen,
    private _platform: Platform,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _userService: UsersService,
    formBuilder: FormBuilder
  ) {
    this.userInfoFormGroup = formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });

    this.validationMessages = {
      'email': [
        { type: 'required', message: 'User email cannot be left blank.' },
        { type: 'email', message: 'Not a valid Email address.' }],
      'password': [
        { type: 'minlength', message: 'Password should be atleast 6 charcters.' },
        { type: 'required', message: 'Password cannot be left blank.' }],
      'confirmPassword': [
        { type: 'minlength', message: 'Password should be atleast 6 charcters.' },
        { type: 'required', message: 'Password cannot be left blank.' }],
      'name': [
        { type: 'required', message: 'Name cannot be left blank.' },
        { type: 'pattern', message: 'Not a valid name.' }]
    };
  }

  isError(name: string, validationType: string): boolean {
    return this.userInfoFormGroup.get(name).hasError(validationType) && (this.userInfoFormGroup.get(name).dirty || this.userInfoFormGroup.get(name).touched)
  }

  ionViewDidEnter() {
    this._splashScreen.hide();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit() {
    // TODO: test email
    this.userInfoFormGroup.get('email').setValue("omkar.nagare@borrowed.com");
  }

  ngAfterViewInit() {
    this.backButtonSubscription$ = this._platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription$.unsubscribe();
  }

  addValidatorsForLoginWithEmailAndPassword() {
    this.userInfoFormGroup.removeControl('name');
    this.userInfoFormGroup.removeControl('confirmPassword');
    this.userInfoFormGroup.updateValueAndValidity();
  }

  addValidatorsForSignUpWithEmailAndPassword() {
    this.userInfoFormGroup.addControl('confirmPassword', new FormControl("", [Validators.required, Validators.minLength(6)]));
    this.userInfoFormGroup.addControl('name', new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")]));
    this.userInfoFormGroup.updateValueAndValidity();
  }

  logInWithEmailAndPassword() {
    if (!this.isSigningUp) {
      // already false so attempt to login
      if (this.userInfoFormGroup.valid && this.userInfoFormGroup.dirty) {
        const credentials: LogInCredentials = this.userInfoFormGroup.value;
        this._authenticationService.logInWithEmailAndPassword(credentials)
          .then((authData) => {
            // console.log(authData);
            this._router.navigate(["/tabs"]);
          }).catch((authDataError) => {
            console.log("Auth Error :", authDataError)
            this._authenticationService.showToast(authDataError);
          });
      } else {
        this._authenticationService.showToast(BorrowedAppConstants.INVALID_FIELDS_MESSAGE);
      }
    } else {
      this.isSigningUp = false;
      this.addValidatorsForLoginWithEmailAndPassword();
    }
  }

  signUp() {
    if (this.isSigningUp) {
      // already true so attempt to signUp
      if (this.userInfoFormGroup.valid && this.userInfoFormGroup.dirty) {

        if (this.userInfoFormGroup.get('password').value !== this.userInfoFormGroup.get('confirmPassword').value) {
          this._authenticationService.showToast(BorrowedAppConstants.PASSWORD_MISSMATCH_MESSAGE);
          return;
        }

        const credentials: LogInCredentials = this.userInfoFormGroup.value;
        const userInfo: UserInfo = this.userInfoFormGroup.value;
        this._authenticationService.signUp(credentials)
          .then((authData) => {
            this._userService.setUserInfo(userInfo).then(response => {
              this._router.navigate(["/tabs"]);
            }).catch(error => {
              this._authenticationService.showToast(BorrowedAppConstants.ERROR_MESSAGE);
            });
          }).catch((authDataError) => {
            console.log("Auth Error :", authDataError);
            this._authenticationService.showToast(authDataError);
          });
      } else {
        this._authenticationService.showToast(BorrowedAppConstants.INVALID_FIELDS_MESSAGE);
      }
    } else {
      this.isSigningUp = true;
      this.addValidatorsForSignUpWithEmailAndPassword();
    }
  }

  logInWithFacebook() {

  }

  logInWithGoogle() {

  }

}
