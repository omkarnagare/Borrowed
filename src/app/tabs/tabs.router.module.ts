import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { CanEnterTabsPagesGuard } from '../guards/can-enter-tabs-pages.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [CanEnterTabsPagesGuard],
    children: [
      {
        path: 'borrowed',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../borrowed/borrowed.module').then(m => m.BorrowedPageModule)
          },
          {
            path: 'item-details/:itemId',
            loadChildren: () =>
              import('../item-details/item-details.module').then(m => m.ItemDetailsPageModule)
          }
        ]
      },
      {
        path: 'urgent-items',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../urgent-items/urgent-items.module').then(m => m.UrgentItemsPageModule)
          },
          {
            path: 'item-details/:itemId',
            loadChildren: () =>
              import('../item-details/item-details.module').then(m => m.ItemDetailsPageModule)
          }
        ]
      },
      {
        path: 'add-item',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../add-item/add-item.module').then(m => m.AddItemPageModule)
          }
        ]
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../account/account.module').then(m => m.AccountPageModule)
          },
          {
            path: 'transaction-complete-items',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('../transcation-complete-items/transcation-complete-items.module').then(m => m.TranscationCompleteItemsPageModule)
              },
              {
                path: 'item-details/:itemId',
                loadChildren: () =>
                  import('../item-details/item-details.module').then(m => m.ItemDetailsPageModule)
              }
            ]
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../settings/settings.module').then(m => m.SettingsPageModule)
          },
          {
            path: 'faqs',
            loadChildren: () =>
              import('../faqs/faqs.module').then(m => m.FAQsPageModule)
          },
          {
            path: 'privacy-policy',
            loadChildren: () =>
              import('../privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule)
          },
          {
            path: 'terms-and-conditions',
            loadChildren: () =>
              import('../terms-and-conditions/terms-and-conditions.module').then(m => m.TermsAndConditionsPageModule)
          },
          {
            path: 'theme-controller',
            loadChildren: () =>
              import('../theme-controller/theme-controller.module').then(m => m.ThemeControllerPageModule)
          },
          {
            path: 'contact-us',
            loadChildren: () =>
              import('../contact-us/contact-us.module').then(m => m.ContactUsPageModule)
          },
          {
            path: 'about-dev',
            loadChildren: () =>
              import('../about-dev/about-dev.module').then(m => m.AboutDevPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/borrowed',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/log-in',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
