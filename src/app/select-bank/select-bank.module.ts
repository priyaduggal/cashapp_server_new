import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectBankPageRoutingModule } from './select-bank-routing.module';

import { SelectBankPage } from './select-bank.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectBankPageRoutingModule
  ],
  declarations: [SelectBankPage]
})
export class SelectBankPageModule {}
