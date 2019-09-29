import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessageComposerPage } from './message-composer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  entryComponents: [MessageComposerPage],
  declarations: [MessageComposerPage]
})
export class MessageComposerPageModule {}
