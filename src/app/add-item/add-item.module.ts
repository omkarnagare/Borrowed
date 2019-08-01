import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddItemPage } from './add-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  entryComponents: [AddItemPage],
  declarations: [AddItemPage]
})
export class AddItemPageModule {}
