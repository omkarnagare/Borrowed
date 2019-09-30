import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { ScrollVanishDirective } from './scroll-vanish.directive';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [ScrollVanishDirective],
  exports: [ScrollVanishDirective],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA  ]
})
export class ScrollVanishDirectiveModule {}
