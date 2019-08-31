import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TranscationCompleteItemsPage } from './transcation-complete-items.page';

const routes: Routes = [
  {
    path: '',
    component: TranscationCompleteItemsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TranscationCompleteItemsPage]
})
export class TranscationCompleteItemsPageModule {}
