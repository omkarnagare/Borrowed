import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { AddItemPage } from './add-item.page';

const routes: Routes = [
  {
    path: '',
    component: AddItemPage
  }
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  // entryComponents: [AddItemPage],
  declarations: [AddItemPage]
})
export class AddItemPageModule {}
