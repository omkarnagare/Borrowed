import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CanEnterLogInPageGuard implements CanActivate {

  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router
  ) { }

  canActivate(
    activtedRouteSnapshot: ActivatedRouteSnapshot,
    routerStateSnapshot: RouterStateSnapshot
  ) {
    return this._authenticationService.getAuthState().pipe(
      map((auth) => {
        if (auth) {
          this._router.navigate(["/tabs"]);
          return false;
        } else {
          return true;
        }
      })
    );
  }

}
