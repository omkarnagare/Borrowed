import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImportantItemsPage } from './important-items.page';
import { ScrollVanishDirectiveModule } from '../directives/scroll-vanish.directive.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ScrollVanishDirectiveModule,
    RouterModule.forChild([{ path: '', component: ImportantItemsPage }])
  ],
  declarations: [ImportantItemsPage]
})
export class ImportantItemsPageModule {}
