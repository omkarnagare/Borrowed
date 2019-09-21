import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountPage } from './account.page';
import { PinUnlockPageModule } from '../pin-unlock/pin-unlock.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    PinUnlockPageModule,
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: AccountPage }])
  ],
  declarations: [AccountPage]
})
export class AccountPageModule {}
