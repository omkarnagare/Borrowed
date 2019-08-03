import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LogInCredentials } from '../types';
import { LogInService } from '../services/log-in.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {

  logInFormGroup: FormGroup;

  constructor(
    private _router: Router,
    private _logInService: LogInService,
    formBuilder: FormBuilder
  ) {
    this.logInFormGroup = formBuilder.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });
  }

  ngOnInit() {
    // TODO: test email
    this.logInFormGroup.get('email').setValue("omkar.nagare@borrowed.com");
  }

  logIn() {
    const credentials: LogInCredentials = this.logInFormGroup.value;
    this._logInService.logIn(credentials)
      .then((authData) => {
        console.log(authData);
        this._router.navigate(["/tabs"]);
      }).catch((authDataError) => {
        console.log("Auth Error :", authDataError)
      });
  }

}
