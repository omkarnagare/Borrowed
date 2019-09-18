import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PinUnlockPage } from './pin-unlock.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  entryComponents: [ PinUnlockPage ],
  declarations: [ PinUnlockPage ]
})
export class PinUnlockPageModule {}
