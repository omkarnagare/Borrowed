import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { CanEnterLogInPageGuard } from './guards/can-enter-log-in-page.guard';

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./tabs/tabs.module").then(m => m.TabsPageModule)
  },
  {
    path: "log-in",
    children: [
      {
        path: '',
        canActivate: [ CanEnterLogInPageGuard ],
        loadChildren: () =>
          import('./log-in/log-in.module').then(m => m.LogInPageModule)
      },
      {
        path: 'privacy-policy',
        loadChildren: () =>
          import('./privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule)
      },
      {
        path: 'terms-and-conditions',
        loadChildren: () =>
          import('./terms-and-conditions/terms-and-conditions.module').then(m => m.TermsAndConditionsPageModule)
      }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
