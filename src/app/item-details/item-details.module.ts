import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ItemDetailsPage } from './item-details.page';
import { MessageComposerPageModule } from '../message-composer/message-composer.module';
import { ContactFinderPageModule } from '../contact-finder/contact-finder.module';

const routes: Routes = [
  {
    path: '',
    component: ItemDetailsPage
  }
];

@NgModule({
  imports: [
    ContactFinderPageModule,
    MessageComposerPageModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ItemDetailsPage]
})
export class ItemDetailsPageModule {}
