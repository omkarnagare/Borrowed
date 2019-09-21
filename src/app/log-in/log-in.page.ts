import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LogInCredentials, UserInfo, SocialUserInfo } from '../types';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { BorrowedAppConstants, UserState, SIGN_IN_OPTIONS } from '../constants';
import { UsersService } from '../services/users.service';
import { PlatformInfoService } from '../services/platform-info.service';
import { AdmobAdsService } from '../services/admob-ads.service';
import { LoaderManagerService } from '../services/loader-manager.service';
import { ToastManagerService } from '../services/toast-manager.service';
import { ConfirmExitService } from '../services/confirm-exit.service';

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
    private _confirmExitService: ConfirmExitService,
    private _loader: LoaderManagerService,
    private _toastManager: ToastManagerService,
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
      // navigator['app'].exitApp();
      this._confirmExitService.confirmExit();
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
    this._loader.stopLoader();
    this._toastManager.showErrorToast(error);
  }

  handleSuccess(response: any) {
    console.log(response);
    this._loader.stopLoader();
    this._router.navigate(["/tabs"]);
  }

  logInWithEmailAndPassword() {
    this._loader.presentLoader().then(() => {

      if (this.userState === UserState.LOG_IN) {
        if (this.userInfoFormGroup.valid && this.userInfoFormGroup.dirty) {
          const credentials: LogInCredentials = this.userInfoFormGroup.value;
          this._authenticationService.logInWithEmailAndPassword(credentials)
            .then((authData) => {
              this.handleSuccess(authData);
            }).catch((authDataError) => {
              // console.error(authDataError);
              if (authDataError.code === BorrowedAppConstants.NO_USER_FOUND_CODE) {
                this.handleError(BorrowedAppConstants.NO_USER_FOUND_MESSAGE);
              } else if (authDataError.code === BorrowedAppConstants.WRONG_PASSWORD_CODE) {
                this.handleError(BorrowedAppConstants.WRONG_PASSWORD_MESSAGE);
              } else if (authDataError.code === BorrowedAppConstants.USER_DISABLED_CODE) {
                this.handleError(BorrowedAppConstants.USER_DISABLED_MESSAGE);
              } else if (authDataError.code === BorrowedAppConstants.INVALID_USER_EMAIL_CODE) {
                this.handleError(BorrowedAppConstants.INVALID_USER_EMAIL_MESSAGE);
              } else {
                this.handleError(authDataError);
              }
            });
        } else {
          this._toastManager.showToast(BorrowedAppConstants.INVALID_FIELDS_MESSAGE);
          this._loader.stopLoader();
        }
      } else {
        this.userState = UserState.LOG_IN;
        this.addValidatorsForLoginWithEmailAndPassword();
        this._loader.stopLoader();
      }

    });
  }

  signUp() {
    this._loader.presentLoader().then(() => {

      if (this.userState === UserState.SIGN_UP) {
        if (this.userInfoFormGroup.valid && this.userInfoFormGroup.dirty) {
          if (this.userInfoFormGroup.get('password').value !== this.userInfoFormGroup.get('confirmPassword').value) {
            this._toastManager.showToast(BorrowedAppConstants.PASSWORD_MISSMATCH_MESSAGE);
            this._loader.stopLoader();
            return;
          }
          const credentials: LogInCredentials = this.userInfoFormGroup.value;
          const userInfo: UserInfo = this.userInfoFormGroup.value;
          userInfo.signedInWith = SIGN_IN_OPTIONS.EMAIL_PASSOWRD;
          this._authenticationService.signUp(credentials)
            .then((authData) => {
              this._userService.setUserInfo(userInfo).then(response => {
                this.handleSuccess(response);
              }).catch(error => {
                this.handleError(error);
              });
            }).catch((authDataError) => {
              // console.error(authDataError);
              if (authDataError.code === BorrowedAppConstants.EMAIL_ALREADY_IN_USE_CODE) {
                this.handleError(BorrowedAppConstants.EMAIL_ALREADY_IN_USE_MESSAGE);
              } else if (authDataError.code === BorrowedAppConstants.WEAK_PASSWORD_CODE) {
                this.handleError(BorrowedAppConstants.WEAK_PASSWORD_MESSAGE);
              } else if (authDataError.code === BorrowedAppConstants.EMAIL_NOT_ENABLED_CODE) {
                this.handleError(BorrowedAppConstants.EMAIL_NOT_ENABLED_MESSAGE);
              } else if (authDataError.code === BorrowedAppConstants.INVALID_USER_EMAIL_CODE) {
                this.handleError(BorrowedAppConstants.INVALID_USER_EMAIL_MESSAGE);
              } else {
                this.handleError(authDataError);
              }
            });
        } else {
          this._toastManager.showToast(BorrowedAppConstants.INVALID_FIELDS_MESSAGE);
          this._loader.stopLoader();
        }
      } else {
        this.userState = UserState.SIGN_UP;
        this.addValidatorsForSignUpWithEmailAndPassword();
        this._loader.stopLoader();
      }

    });
  }

  forgotPassword() {
    this._loader.presentLoader().then(() => {

      if (this.userState === UserState.FORGOT_PASSWORD) {
        if (this.userInfoFormGroup.valid && this.userInfoFormGroup.dirty) {
          this._authenticationService.resetPassword(this.userInfoFormGroup.get('email').value)
            .then(response => {
              console.log(response);
              this._loader.stopLoader();
              this.showAlertForResetPassword();
            }).catch(authDataError => {
              // console.error(authDataError);
              if (authDataError.code === BorrowedAppConstants.NO_USER_FOUND_CODE) {
                this.handleError(BorrowedAppConstants.NO_USER_FOUND_MESSAGE);
              } else if (authDataError.code === BorrowedAppConstants.INVALID_USER_EMAIL_CODE) {
                this.handleError(BorrowedAppConstants.INVALID_USER_EMAIL_MESSAGE);
              } else {
                this.handleError(authDataError);
              }
            });
        } else {
          this._toastManager.showToast(BorrowedAppConstants.INVALID_FIELDS_MESSAGE);
          this._loader.stopLoader();
        }
      } else {
        this.userState = UserState.FORGOT_PASSWORD
        this.addValidatorsForForgotPasswordWithEmailAndPassword();
        this._loader.stopLoader();
      }

    });
  }

  async showAlertForResetPassword() {
    const alert = await this._alertController.create({
      header: 'Success',
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
      this.setUserInfoInFirebase(SIGN_IN_OPTIONS.FACEBOOK);
    }).catch(error => {
      this.handleError(BorrowedAppConstants.LOGIN_FAILED_MESSAGE);
    });
  }

  logInWithGooglePlus() {
    this._authenticationService.logInWithGooglePlus().then(response => {
      console.log(response);
      this.setUserInfoInFirebase(SIGN_IN_OPTIONS.GOOGLE);
    }).catch(error => {
      this.handleError(BorrowedAppConstants.LOGIN_FAILED_MESSAGE);
    });
  }

  logInWithTwitter() {
    this._authenticationService.logInWithTwitter().then(response => {
      console.log(response);
      this.setUserInfoInFirebase(SIGN_IN_OPTIONS.TWITTER);
    }).catch(error => {
      this.handleError(BorrowedAppConstants.LOGIN_FAILED_MESSAGE);
    });
  }

  setUserInfoInFirebase(signedInWith: SIGN_IN_OPTIONS) {
    this._authenticationService.getAuth().onAuthStateChanged(user => {
      if (user) {
        const userInfo: SocialUserInfo = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          signedInWith: signedInWith
        };
        this._userService.setUserInfoFromSocialNetworks(userInfo).then(response => {
          this._router.navigate(["/tabs"]);
        }).catch(error => {
          this._toastManager.showErrorToast(error);
        }).finally(() => {
          this._loader.stopLoader();
        });
      }
    });
  }
}
