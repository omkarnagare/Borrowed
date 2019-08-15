import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { CanEnterTabsPagesGuard } from '../guards/can-enter-tabs-pages.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [ CanEnterTabsPagesGuard ],
    children: [
      {
        path: 'borrowed',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab1/tab1.module').then(m => m.Tab1PageModule)
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
              import('../tab2/tab2.module').then(m => m.Tab2PageModule)
          },
          {
            path: 'item-details/:itemId',
            loadChildren: () =>
              import('../item-details/item-details.module').then(m => m.ItemDetailsPageModule)
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab3/tab3.module').then(m => m.Tab3PageModule)
          },
          {
            path: 'settings',
            loadChildren: () =>
              import('../settings/settings.module').then(m => m.SettingsPageModule)
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
export class TabsPageRoutingModule {}
