import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactFinderPage } from './contact-finder.page';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule
  ],
  entryComponents: [ContactFinderPage],
  declarations: [ContactFinderPage]
})
export class ContactFinderPageModule { }
