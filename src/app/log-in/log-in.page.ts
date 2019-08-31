import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LogInCredentials, UserInfo, SocialUserInfo } from '../types';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { BorrowedAppConstants, UserState } from '../constants';
import { UsersService } from '../services/users.service';
import { PlatformInfoService } from '../services/platform-info.service';

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
  userState: UserState;
  isMobilePlatform: boolean = false;

  constructor(
    private _splashScreen: SplashScreen,
    private _platform: Platform,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _userService: UsersService,
    private _platformInfoService: PlatformInfoService,
    private _alertController: AlertController,
    formBuilder: FormBuilder
  ) {
    this.isMobilePlatform = this._platformInfoService.isMobilePlatform()
    this.userInfoFormGroup = formBuilder.group({
      name: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(6)]]
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
    this.removeAllControls();
    this.userInfoFormGroup.addControl('email', new FormControl("", [Validators.required, Validators.email]));
    this.userInfoFormGroup.addControl('password', new FormControl("", [Validators.required, Validators.minLength(6)]));
    this.userInfoFormGroup.updateValueAndValidity();
  }

  addValidatorsForSignUpWithEmailAndPassword() {
    this.removeAllControls();
    this.userInfoFormGroup.addControl('email', new FormControl("", [Validators.required, Validators.email]));
    this.userInfoFormGroup.addControl('password', new FormControl("", [Validators.required, Validators.minLength(6)]));
    this.userInfoFormGroup.addControl('confirmPassword', new FormControl("", [Validators.required, Validators.minLength(6)]));
    this.userInfoFormGroup.addControl('name', new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")]));
    this.userInfoFormGroup.updateValueAndValidity();
  }

  addValidatorsForForgotPasswordWithEmailAndPassword() {
    this.removeAllControls();
    this.userInfoFormGroup.addControl('email', new FormControl("", [Validators.required, Validators.email]));
    this.userInfoFormGroup.updateValueAndValidity();
  }

  removeAllControls() {
    this.userInfoFormGroup.removeControl('name');
    this.userInfoFormGroup.removeControl('email');
    this.userInfoFormGroup.removeControl('password');
    this.userInfoFormGroup.removeControl('confirmPassword');
  }

  handleError(error: any) {
    console.error(error);
    this._authenticationService.stopLoader();
    this._authenticationService.showToast(error);
  }

  handleSuccess(response: any) {
    console.log(response);
    this._authenticationService.stopLoader();
    this._router.navigate(["/tabs"]);
  }

  logInWithEmailAndPassword() {
    this._authenticationService.presentLoader().then(() => {

      if (this.userState === UserState.LOG_IN) {
        if (this.userInfoFormGroup.valid && this.userInfoFormGroup.dirty) {
          const credentials: LogInCredentials = this.userInfoFormGroup.value;
          this._authenticationService.logInWithEmailAndPassword(credentials)
            .then((authData) => {
              this.handleSuccess(authData);
            }).catch((authDataError) => {
              this.handleError(authDataError);
            });
        } else {
          this._authenticationService.showToast(BorrowedAppConstants.INVALID_FIELDS_MESSAGE);
          this._authenticationService.stopLoader();
        }
      } else {
        this.userState = UserState.LOG_IN;
        this.addValidatorsForLoginWithEmailAndPassword();
        this._authenticationService.stopLoader();
      }

    });
  }

  signUp() {
    this._authenticationService.presentLoader().then(() => {

      if (this.userState === UserState.SIGN_UP) {
        if (this.userInfoFormGroup.valid && this.userInfoFormGroup.dirty) {
          if (this.userInfoFormGroup.get('password').value !== this.userInfoFormGroup.get('confirmPassword').value) {
            this._authenticationService.showToast(BorrowedAppConstants.PASSWORD_MISSMATCH_MESSAGE);
            this._authenticationService.stopLoader();
            return;
          }
          const credentials: LogInCredentials = this.userInfoFormGroup.value;
          const userInfo: UserInfo = this.userInfoFormGroup.value;
          this._authenticationService.signUp(credentials)
            .then((authData) => {
              this._userService.setUserInfo(userInfo).then(response => {
                this.handleSuccess(response);
              }).catch(error => {
                this.handleError(error);
              });
            }).catch((authDataError) => {
              this.handleError(authDataError);
            });
        } else {
          this._authenticationService.showToast(BorrowedAppConstants.INVALID_FIELDS_MESSAGE);
          this._authenticationService.stopLoader();
        }
      } else {
        this.userState = UserState.SIGN_UP;
        this.addValidatorsForSignUpWithEmailAndPassword();
        this._authenticationService.stopLoader();
      }

    });
  }

  forgotPassword() {
    this._authenticationService.presentLoader().then(() => {

      if (this.userState === UserState.FORGOT_PASSWORD) {
        if (this.userInfoFormGroup.valid && this.userInfoFormGroup.dirty) {
          this._authenticationService.resetPassword(this.userInfoFormGroup.get('email').value)
            .then(response => {
              console.log(response);
              this._authenticationService.stopLoader();
              this.showAlertForResetPassword();
            }).catch(error => {
              this.handleError(error);
            });
        } else {
          this._authenticationService.showToast(BorrowedAppConstants.INVALID_FIELDS_MESSAGE);
          this._authenticationService.stopLoader();
        }
      } else {
        this.userState = UserState.FORGOT_PASSWORD
        this.addValidatorsForForgotPasswordWithEmailAndPassword();
        this._authenticationService.stopLoader();
      }

    });
  }

  async showAlertForResetPassword() {
    const alert = await this._alertController.create({
      message: 'Please check your email inbox for a password reset link',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  logInWithFacebook() {
    this._authenticationService.logInWithFacebook().then(response => {
      console.log(response);
      this.setUserInfoInFirebase();
    }).catch(error => {
      this.handleError(error);
    });
  }

  logInWithGooglePlus() {
    this._authenticationService.logInWithGooglePlus().then(response => {
      console.log(response);
      this.setUserInfoInFirebase();
    }).catch(error => {
      this.handleError(error);
    });
  }

  logInWithTwitter() {
    this._authenticationService.logInWithTwitter().then(response => {
      console.log(response);
      this.setUserInfoInFirebase();
    }).catch(error => {
      this.handleError(error);
    });
  }

  setUserInfoInFirebase() {
    this._authenticationService.getAuth().onAuthStateChanged(user => {
      if (user) {
        const userInfo: SocialUserInfo = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL
        };
        this._userService.setUserInfoFromGooglePlus(userInfo).then(response => {
          this._router.navigate(["/tabs"]);
        }).catch(error => {
          this._authenticationService.showToast(error);
        }).finally(() => {
          this._authenticationService.stopLoader();
        });
      }
    });
  }
}
