import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BorrowedPage } from './borrowed.page';
import { PinUnlockPageModule } from '../pin-unlock/pin-unlock.module';

@NgModule({
  imports: [
    PinUnlockPageModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: BorrowedPage }])
  ],
  declarations: [BorrowedPage]
})
export class BorrowedPageModule {}
