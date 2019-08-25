import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ThemeControllerPage } from './theme-controller.page';

const routes: Routes = [
  {
    path: '',
    component: ThemeControllerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ThemeControllerPage]
})
export class ThemeControllerPageModule {}
